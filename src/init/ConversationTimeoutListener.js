import {
  getTaskStatus,
  getChannelSid,
  isPostponed
} from '../utils/task-data-helpers';
import { getLastMessage } from '../utils/channel-data-helpers';
import { TaskStatuses } from '../utils/constants';
import ConversationTimeoutHandler from '../utils/conversation-timeout-handler';

let prevChangeData = {
  assignedTasks: 0,
  postponedTasks: 0,
  totalMessages: 0
};

/**
 * @param flex { typeof import('@twilio/flex-ui') }
 * @param manager { import('@twilio/flex-ui').Manager }
 */
export default (flex, manager) => {
  const { store, serviceConfiguration } = manager;
  const { NMG } = serviceConfiguration.attributes;
  const timeoutHandler = new ConversationTimeoutHandler();
  const configuredChannelTypes = Object.keys(NMG.conversationTimeouts);

  store.subscribe(() => {
    const { flex } = manager.store.getState();
    const { worker, chat } = flex;
    const taskArray = Array.from(worker.tasks.values());
    const tasksWithDefinedConfigsAndChannels = taskArray.filter(task => {
      if (configuredChannelTypes.includes(task.attributes.channelType)) {
        const chatChannel = chat.channels[getChannelSid(task)];
        return chatChannel && chatChannel.source !== undefined;
      }
      return false;
    });

    // Cheap change detection so we're not running our logic too frequently (redux store updates a lot)
    // Attempts to listen to slices of store (redux-watch), didn't seem to work as needed
    const nextChangeData = generateChangeDetectionData(
      tasksWithDefinedConfigsAndChannels,
      chat.channels
    );

    if (shouldUpdate(nextChangeData)) {
      // There was a change we care about, so save this new data for comparing in next redux store change
      prevChangeData = { ...nextChangeData };

      const timeoutData = tasksWithDefinedConfigsAndChannels.map(task => {
        // Pair task and channel for ease of use
        const channel = chat.channels[getChannelSid(task)];
        return { task, channel };
      });
      timeoutHandler.update(timeoutData, manager);
    }
  });
};

// We only care to update timeouts if 3 pieces of data changes
//   - # of assigned tasks
//   - # of postponed tasks
//   - Message count in any chat channel (cheat by just comparing sum of all messages)
function generateChangeDetectionData(tasks, channels) {
  return tasks.reduce(
    (result, task) => {
      const isAssigned = getTaskStatus(task) === TaskStatuses.assigned;
      const lastMessage = getLastMessage(channels[getChannelSid(task)]);
      const channelMessages =
        lastMessage !== undefined ? lastMessage.index + 1 : 0;

      return {
        assignedTasks: isAssigned
          ? result.assignedTasks + 1
          : result.assignedTasks,
        postponedTasks: isPostponed(task)
          ? result.postponedTasks + 1
          : result.postponedTasks,
        totalMessages: result.totalMessages + channelMessages
      };
    },
    { assignedTasks: 0, postponedTasks: 0, totalMessages: 0 }
  );
}

// If any of the data mentioned in generateChangeDetectionData has changed, we need to update timeouts
function shouldUpdate(nextChangeData) {
  const assignedTasksChanged =
    nextChangeData.assignedTasks !== prevChangeData.assignedTasks;
  const postponedTasksChanged =
    nextChangeData.postponedTasks !== prevChangeData.postponedTasks;
  const messageCountChanged =
    nextChangeData.totalMessages !== prevChangeData.totalMessages;
  return assignedTasksChanged || postponedTasksChanged || messageCountChanged;
}
