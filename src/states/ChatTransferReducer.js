import produce from 'immer';

const ACTION_UPDATE_SELECTED_MESSAGES = 'UPDATE_SELECTED_MESSAGES';
const ACTION_CLEAR_MESSAGES = 'CLEAR_MESSAGES';

const initialState = {
  selectedMessages: {},
}

export class Actions {
  static updateSelectedMessages = (taskSid, message) => ({
    type: ACTION_UPDATE_SELECTED_MESSAGES,
    taskSid,
    message,
  });

  static clearMessages = (taskSid) => ({
    type: ACTION_CLEAR_MESSAGES,
    taskSid,
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_UPDATE_SELECTED_MESSAGES: {
      const { message, taskSid } = action;
      
      const messages = (state.selectedMessages[taskSid])
        ? [...state.selectedMessages[taskSid]]
        : [];

      return produce(state, (draftState) => {
        if (messages.some(msg => msg.index === message.index)) {
          draftState.selectedMessages[taskSid] = messages.filter(msg => msg.index !== message.index)
        } else if (messages.length < 3) {
          messages.push(message);
          draftState.selectedMessages[taskSid] = messages;
        }
      });
    }
    case ACTION_CLEAR_MESSAGES: {
      const { taskSid } = action;
      return produce(state, (draftState) => {
        delete draftState.selectedMessages[taskSid];
      });
    }
    default: {
      return state;
    }
  }
}