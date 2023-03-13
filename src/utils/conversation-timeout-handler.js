import { Manager, Actions } from '@twilio/flex-ui';
import TimeoutService from './timeout-service';
import { bindActionCreators } from 'redux';
import { Actions as TaskStatusActions } from '../states/TaskStatusIndicatorReducer';
import { getTaskStatus } from './task-data-helpers';
import {
  findMostRecentMessageByIdentity,
  isMessageAuthorCurrentAgent,
  getLastMessage,
  getConversationState
} from './channel-data-helpers';
import {
  getUnresponsiveAgentStartMoment,
  getInactiveCustomerStartMoment,
  getPostponedTaskStartMoment,
  getUnresponsiveAgentThresholds,
  getInactiveCustomerThresholds,
  getPostponedTaskThresholds,
  processInactiveTask,
  processUnresponsiveTask,
  resumePostponedTask,
  setChannelConversationStatus
} from './timeout-helpers';
import {
  TaskStatuses,
  ConversationState,
  ConversationStatus
} from './constants';
import { TASK_INDICATOR_TYPES } from './constants';

export default class ConversationTimeoutHandler {
  constructor() {
    const { serviceConfiguration, store } = Manager.getInstance();
    const { NMG } = serviceConfiguration.attributes;

    this.conversations = {};
    this.timeoutConfigs = NMG.conversationTimeouts;
    this.uiIndicatorTimeouts = new TimeoutService();
    this.taskTimeouts = new TimeoutService();
    this.indicatorActions = {
      addIndicator: bindActionCreators(
        TaskStatusActions.addTaskStatusIndicator,
        store.dispatch
      ),
      removeIndicator: bindActionCreators(
        TaskStatusActions.removeTaskStatusIndicator,
        store.dispatch
      )
    };
  }

  // This is called with an array of objects: [{ task, channel }]
  // It's pre-filtered to ensure:
  //   - channel.source is defined
  //   - there is a timeout config present for task.attributes.channelType
  update(dataArray, manager) {
    dataArray.forEach(async data => {
      const { task, channel } = data;
      const { taskSid } = task;

      switch (getTaskStatus(task)) {
        case TaskStatuses.assigned: {
          if (this.conversations[taskSid]) {
            this._updateConversationData(task, channel);

            await this._applyTimeouts(task, channel, manager);
          } else {
            await this._initConversationData(task, channel);
            await this._applyTimeouts(task, channel, manager);
          }
          break;
        }
        case TaskStatuses.wrapping:
        case TaskStatuses.completed: {
          // Timeouts no longer apply to this conversation, remove timeouts and any UI status flags
          this.indicatorActions.removeIndicator(taskSid);
          this.uiIndicatorTimeouts.remove(taskSid, true);
          this.taskTimeouts.remove(taskSid, true);
          break;
        }
        default: {
          // Do nothing
        }
      }
    });
  }

  async _initConversationData(task, channel) {
    // We just need to find the most recent "not-current-agent" message to use here
    const customerMessage = await findMostRecentMessageByIdentity(
      channel,
      message => !isMessageAuthorCurrentAgent(message)
    );
    const agentMessage = await findMostRecentMessageByIdentity(
      channel,
      isMessageAuthorCurrentAgent
    );

    const conversationState = getConversationState(task, {
      agentMessage,
      customerMessage
    });

    this.conversations[task.taskSid] = {
      lastAgentMessage: agentMessage,
      lastCustomerMessage: customerMessage,
      lastMessageIndex: getLastMessage(channel).index,
      state: conversationState
    };
  }

  _updateConversationData(task, channel) {
    const { taskSid } = task;
    const { messages } = channel;
    const {
      lastMessageIndex: prevLastMessageIdx,
      lastCustomerMessage,
      lastAgentMessage
    } = this.conversations[taskSid];
    const { index: nextLastMessageIdx } = getLastMessage(channel);

    let lastMessages = {
      agentMessage: lastAgentMessage,
      customerMessage: lastCustomerMessage
    };

    if (prevLastMessageIdx !== nextLastMessageIdx) {
      const message = messages.find(
        message => message.index === nextLastMessageIdx
      );
      if (message && message.source) {
        const { index, timestamp } = message.source;
        const isAgentMessage = isMessageAuthorCurrentAgent(message.source);

        if (isAgentMessage) {
          lastMessages = {
            agentMessage: { index, timestamp },
            customerMessage: lastCustomerMessage
          };
        } else {
          lastMessages = {
            agentMessage: lastAgentMessage,
            customerMessage: { index, timestamp }
          };
        }
      }
    }

    this.conversations[taskSid] = {
      lastAgentMessage: lastMessages.agentMessage,
      lastCustomerMessage: lastMessages.customerMessage,
      lastMessageIndex: nextLastMessageIdx,
      state: getConversationState(task, lastMessages)
    };
  }

  async _applyTimeouts(task, channel, manager) {
    const { taskSid } = task;
    const { state } = this.conversations[taskSid];

    switch (state) {
      case ConversationState.WaitingForAgent: {
        this._applyUnresponsiveAgentTimeouts(task, channel, manager);
        break;
      }
      case ConversationState.WaitingForCustomer: {
        await this._applyInactiveCustomerTimeouts(task, channel);
        break;
      }
      case ConversationState.Postponed: {
        this._applyPostponedTaskTimeouts(task);
        break;
      }
      default: {
        // Do nothing
      }
    }
  }

  _applyUnresponsiveAgentTimeouts(task, channel, manager) {
    const { taskSid, attributes } = task;
    const startMoment = getUnresponsiveAgentStartMoment(
      task,
      channel,
      this.conversations[taskSid]
    );

    const thresholds = getUnresponsiveAgentThresholds(
      startMoment,
      attributes.channelType
    );

    if (thresholds) {
      const { uiIndicatorThreshold, taskTimeoutThreshold } = thresholds;
      this.indicatorActions.removeIndicator(taskSid);
      if (uiIndicatorThreshold) {
        this.uiIndicatorTimeouts.add(
          taskSid,
          uiIndicatorThreshold,
          [taskSid, TASK_INDICATOR_TYPES.UnresponsiveAgent],
          this.indicatorActions.addIndicator
        );
      }
      if (taskTimeoutThreshold) {
        this.taskTimeouts.add(
          taskSid,
          taskTimeoutThreshold,
          [task, channel],
          async (task, channel) => {
            await processUnresponsiveTask(task, channel, manager);
            this.indicatorActions.removeIndicator(taskSid);
            Actions.invokeAction('TaskTimedOut', { task });
          }
        );
      }
    }
  }

  async _applyInactiveCustomerTimeouts(task, channel) {
    const { taskSid, attributes } = task;
    if (
      channel.source.attributes.conversationStatus ===
      ConversationStatus.Reassigned
    ) {
      // We're applying inactive customer timeouts, which means the current agent sent a message
      // If the task was one that was reassigned, we can now mark it as "active" again
      await setChannelConversationStatus(channel, ConversationStatus.Active);
    }
    const startMoment = getInactiveCustomerStartMoment(
      this.conversations[taskSid]
    );

    const thresholds = getInactiveCustomerThresholds(
      startMoment,
      attributes.channelType
    );

    if (thresholds) {
      const {
        uiIndicatorThreshold,
        taskTimeoutThreshold,
        channelTTL
      } = thresholds;
      this.indicatorActions.removeIndicator(taskSid);
      if (uiIndicatorThreshold) {
        this.uiIndicatorTimeouts.add(
          taskSid,
          uiIndicatorThreshold,
          [taskSid, TASK_INDICATOR_TYPES.InactiveCustomer],
          this.indicatorActions.addIndicator
        );
      }
      if (taskTimeoutThreshold) {
        this.taskTimeouts.add(
          taskSid,
          taskTimeoutThreshold,
          [task, channel, channelTTL],
          async (task, channel, channelTTL) => {
            await processInactiveTask(task, channel, channelTTL);
            this.indicatorActions.removeIndicator(task.taskSid);
            Actions.invokeAction('TaskTimedOut', { task });
          }
        );
      }
    }
  }

  _applyPostponedTaskTimeouts(task) {
    const { taskSid, attributes } = task;
    const startMoment = getPostponedTaskStartMoment(task);
    const thresholds = getPostponedTaskThresholds(
      startMoment,
      attributes.channelType
    );
    if (thresholds) {
      const { uiIndicatorThreshold, taskTimeoutThreshold } = thresholds;
      this.indicatorActions.removeIndicator(taskSid);
      if (uiIndicatorThreshold) {
        this.uiIndicatorTimeouts.add(
          taskSid,
          uiIndicatorThreshold,
          [taskSid, TASK_INDICATOR_TYPES.Postponed],
          this.indicatorActions.addIndicator
        );
      }
      if (taskTimeoutThreshold) {
        this.taskTimeouts.add(
          taskSid,
          taskTimeoutThreshold,
          [task],
          async task => {
            await resumePostponedTask(task);
            this.indicatorActions.removeIndicator(task.taskSid);
          }
        );
      }
    }
  }
}
