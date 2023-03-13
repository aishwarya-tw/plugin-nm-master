const ACTION_REMOVE_PROCESSED_UNRESPONSIVE_TASK =
  'REMOVE_PROCESSED_UNRESPONSIVE_TASK';
const ACTION_PROCESSED_UNRESPONSIVE_TASK = 'PROCESSED_UNRESPONSIVE_TASK';

const initialState = {};

export class Actions {
  static processedUnresponsiveTask = channelSid => ({
    type: ACTION_PROCESSED_UNRESPONSIVE_TASK,
    channelSid
  });

  static removeProcessedUnresponsiveTask = channelSid => ({
    type: ACTION_REMOVE_PROCESSED_UNRESPONSIVE_TASK,
    channelSid
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_PROCESSED_UNRESPONSIVE_TASK: {
      const { channelSid } = action;
      return {
        ...state,
        [channelSid]: { ...state[channelSid] }
      };
    }

    case ACTION_REMOVE_PROCESSED_UNRESPONSIVE_TASK: {
      const { channelSid } = action;
      const newState = { ...state };
      delete newState[channelSid];
      return { ...newState };
    }

    default:
      return state;
  }
};
