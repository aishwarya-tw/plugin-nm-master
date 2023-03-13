import { Manager, ChatOrchestrator, Actions } from '@twilio/flex-ui';
import { Actions as ConversationTimeoutActions } from '../states/ConversationTimeoutReducer';
import moment from 'moment';
import Resource from '../utils/resource';
import { getPostponePeriods } from './task-data-helpers';
import { ConversationStatus, BACKEND_ERROR_NOTIFICATION } from './constants';
import * as Flex from '@twilio/flex-ui';

export function getUnresponsiveAgentStartMoment(
  task,
  channel,
  conversationData
) {
  const { dateUpdated, attributes: taskAttributes } = task;
  const { attributes } = channel.source;
  const postponePeriods = getPostponePeriods(task);
  const { lastAgentMessage, lastCustomerMessage } = conversationData;

  const { reassignedWorkerSid } = taskAttributes;

  let timeoutStartMoment;
  // Current agent has not sent a message yet in the conversation
  if (!lastAgentMessage) {
    // Use task dateUpdated as timeout timeoutStartMoment
    timeoutStartMoment = moment(dateUpdated);

    const lastCustomerMoment = moment(lastCustomerMessage.timestamp);
    // Customer has sent messages since current agent accepted the task
    if (lastCustomerMoment.isAfter(timeoutStartMoment)) {
      // Use most recent customer message as timeout timeoutStartMoment

      timeoutStartMoment = lastCustomerMoment;
    }

    // Task was previously postponed, add the total duration of postpones to the start time
    if (postponePeriods.length) {
      const totalPostponeTime = postponePeriods.reduce((acc, period) => {
        acc += period.endTime - period.startTime;
        return acc;
      }, 0);
      timeoutStartMoment = moment(timeoutStartMoment).add(
        totalPostponeTime,
        'milliseconds'
      );
    }
  } else {
    // Current agent has not replied to a customer message yet in the conversation
    // Use most recent customer timestamp as timeoutStartMoment
    timeoutStartMoment = moment(lastCustomerMessage.timestamp);
    // Task was reassigned and the last message was from the same agent

    const reassignedTask =
      attributes.conversationStatus === ConversationStatus.Reassigned ||
      reassignedWorkerSid;

    if (
      reassignedTask &&
      moment(lastAgentMessage.timestamp).isBefore(dateUpdated)
    ) {
      timeoutStartMoment = moment(dateUpdated);

      const lastCustomerMoment = moment(lastCustomerMessage.timestamp);

      if (lastCustomerMoment.isAfter(timeoutStartMoment)) {
        timeoutStartMoment = lastCustomerMoment;
      }
    }

    if (moment(dateUpdated).isAfter(timeoutStartMoment)) {
      timeoutStartMoment = dateUpdated;
    }
    // Task was previously postponed, add the total duration of postpones to the start time
    if (postponePeriods.length) {
      const totalPostponeTime = postponePeriods.reduce((acc, period) => {
        acc += period.endTime - period.startTime;
        return acc;
      }, 0);
      timeoutStartMoment = moment(timeoutStartMoment).add(
        totalPostponeTime,
        'milliseconds'
      );
    }
  }

  return timeoutStartMoment;
}

export function getInactiveCustomerStartMoment(conversationData) {
  const { lastAgentMessage } = conversationData;

  return moment(lastAgentMessage.timestamp);
}

export function getPostponedTaskStartMoment(task) {
  const postponePeriods = getPostponePeriods(task);
  const mostRecentPostponement = postponePeriods[postponePeriods.length - 1];
  return moment(mostRecentPostponement.startTime);
}

export async function setChannelConversationStatus(
  channel,
  conversationStatus
) {
  const { attributes } = channel.source;
  try {
    await channel.source.updateAttributes({
      ...attributes,
      conversationStatus
    });
  } catch (e) {
    console.error(e);
    const errorMessage = 'Could not set channel conversation status.';
    Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
      errorMessage
    });
  }
}

export function getUnresponsiveAgentThresholds(start, channelType) {
  const { serviceConfiguration } = Manager.getInstance();
  const { NMG } = serviceConfiguration.attributes;
  const { conversationTimeouts } = NMG;

  if (conversationTimeouts[channelType]) {
    const {
      UnresponsiveAgentWarning,
      UnresponsiveAgentDelay
    } = conversationTimeouts[channelType];
    let uiIndicatorThreshold;
    let taskTimeoutThreshold;
    if (UnresponsiveAgentWarning !== -1) {
      uiIndicatorThreshold = moment(start).add(
        UnresponsiveAgentWarning,
        'seconds'
      );
    }
    if (UnresponsiveAgentDelay !== -1) {
      taskTimeoutThreshold = moment(start).add(
        UnresponsiveAgentDelay,
        'seconds'
      );
    }

    return { uiIndicatorThreshold, taskTimeoutThreshold };
  } else {
    console.error(
      `Channel type: "${channelType}" has no configuration defined in conversationTimeouts`
    );
    return undefined;
  }
}

export function getInactiveCustomerThresholds(start, channelType) {
  const { serviceConfiguration } = Manager.getInstance();
  const { NMG } = serviceConfiguration.attributes;
  const { conversationTimeouts } = NMG;

  if (conversationTimeouts[channelType]) {
    const {
      CustomerInactivityWarning,
      CustomerInactivityDelay,
      InactiveChannelTTL
    } = conversationTimeouts[channelType];
    let uiIndicatorThreshold;
    let taskTimeoutThreshold;
    let channelTTL;
    if (CustomerInactivityWarning !== -1) {
      uiIndicatorThreshold = moment(start).add(
        CustomerInactivityWarning,
        'seconds'
      );
    }
    if (CustomerInactivityDelay !== -1) {
      taskTimeoutThreshold = moment(start).add(
        CustomerInactivityDelay,
        'seconds'
      );
    }
    if (InactiveChannelTTL !== -1) {
      channelTTL =
        InactiveChannelTTL === 0 ?
          0 : moment().add(InactiveChannelTTL, 'seconds').unix();
    }

    return { uiIndicatorThreshold, taskTimeoutThreshold, channelTTL };
  } else {
    console.error(
      `Channel type: "${channelType}" has no configuration defined in conversationTimeouts`
    );
    return undefined;
  }
}

export function getPostponedTaskThresholds(start, channelType) {
  const { serviceConfiguration } = Manager.getInstance();
  const { NMG } = serviceConfiguration.attributes;
  const { conversationTimeouts } = NMG;

  if (conversationTimeouts[channelType]) {
    const { PostponeLimit } = conversationTimeouts[channelType];
    let uiIndicatorThreshold;
    let taskTimeoutThreshold;
    if (PostponeLimit !== -1) {
      uiIndicatorThreshold = moment(start);
      taskTimeoutThreshold = moment(start).add(PostponeLimit, 'seconds');
    }
    return { uiIndicatorThreshold, taskTimeoutThreshold };
  } else {
    console.error(
      `Channel type: "${channelType}" has no configuration defined in conversationTimeouts`
    );
    return undefined;
  }
}

export async function processInactiveTask(task, channel, channelTTL) {
  const manager = Manager.getInstance();
  const state = manager.store.getState();

  console.log("Running processInactiveTask function");
  // workerTasks is a Map with reservation SID as a key, and event object for a value
  const workerTasks = state.flex.worker.tasks;
  const taskIterator = workerTasks.entries();
  const tasks = [];
  for (const reservationEvent of taskIterator) {
    if (reservationEvent.length > 1 && reservationEvent[1] && reservationEvent[1].taskSid) {
      tasks.push(reservationEvent[1].taskSid);
    }
  }

  console.log(`Tasks in store for the current worker: ${JSON.stringify(tasks)}`);

  if (tasks.includes(task.taskSid)) {

    console.log(`Store includes current task: ${task.taskSid}`)

    const { taskSid, workerSid, attributes: taskAttributes } = task;
    const { sid: chatChannelSid, attributes: chatAttributes } = channel.source;

    const channelAttributes = {
      ...chatAttributes,
      conversationStatus: ConversationStatus.Inactive,
      taskAttributes: { ...taskAttributes, workerSid }
    };

    await Resource('mark-channel-inactive').create({
      taskSid,
      chatChannelSid,
      channelTTL,
      channelAttributes
    });
  }
}

export async function processUnresponsiveTask(task, channel, manager) {
  const {
    taskSid,
    workflowSid: taskWorkflowSid,
    taskChannelSid,
    attributes: taskAttributes
  } = task;

  const { serviceConfiguration } = manager;
  const { NMG } = serviceConfiguration.attributes;
  const { reassignedTaskResetPeriod } = NMG;
  const store = manager.store;
  const conversationTimeoutState = store.getState().neimanMarcus
    .conversationTimeouts;

  const { sid: chatChannelSid, attributes: chatAttributes } = channel.source;
  const channelAttributes = {
    ...chatAttributes,
    conversationStatus: ConversationStatus.Reassigned
  };
  delete taskAttributes.workerSid;
  delete taskAttributes.postponePeriods;

  // there is a bug causing this method to run in rapid succession - using redux to record tasks that have been processed already
  if (!conversationTimeoutState[chatChannelSid]) {
    store.dispatch(
      ConversationTimeoutActions.processedUnresponsiveTask(chatChannelSid)
    );
    // Remove orchestration so that Flexy Proxy session isn't deleted when agent is unresponsive
    // This doesn't matter for the inactive customer bit because when the task enters studio, it creates a new session
    removeDefaultChatChannelOrchestrations();
    const workerSid = Manager.getInstance().workerClient.sid;

    await Resource('reassign-unresponsive-task').create({
      taskSid,
      taskWorkflowSid,
      taskChannelSid,
      taskAttributes,
      chatChannelSid,
      channelAttributes,
      workerSid
    });

    await resetState(chatChannelSid, store, reassignedTaskResetPeriod);
    restoreDefaultChatChannelOrchestrations();
  } else {
    console.log('Task is already reassigned, skipping reassignment step');
  }
}

async function resetState(chatChannelSid, store, reassignedTaskResetPeriod) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      store.dispatch(
        ConversationTimeoutActions.removeProcessedUnresponsiveTask(
          chatChannelSid
        )
      );

      resolve();
    }, reassignedTaskResetPeriod);
  });
}

export async function resumePostponedTask(task) {
  const { attributes } = task;
  const postponePeriods = getPostponePeriods(task).map(period => {
    if (!period.endTime) {
      return { ...period, endTime: Date.now() };
    }
    return period;
  });
  task
    .setAttributes({ ...attributes, postponePeriods, postponed: false })
    .then(() => Actions.invokeAction('ResumeTask', task));
}

function removeDefaultChatChannelOrchestrations() {
  ChatOrchestrator.setOrchestrations('wrapup', []);
  ChatOrchestrator.setOrchestrations('completed', ['LeaveChatChannel']);
}

function restoreDefaultChatChannelOrchestrations() {
  ChatOrchestrator.setOrchestrations('wrapup', ['DeactivateChatChannel']);
  ChatOrchestrator.setOrchestrations('completed', [
    'DeactivateChatChannel',
    'LeaveChatChannel'
  ]);
}
