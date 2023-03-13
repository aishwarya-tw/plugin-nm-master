const ACTION_SET_CHAT_INPUT_TEXT = 'SET_CHAT_INPUT_TEXT';
const ACTION_SET_CHAT_ATTACHMENT = 'SET_CHAT_ATTACHMENT';
const ACTION_CHAT_MESSAGE_SENT = 'CHAT_MESSAGE_SENT';

const initialState = {};

export class Actions {
  static setInputText = (taskSid, inputText) => ({
    type: ACTION_SET_CHAT_INPUT_TEXT,
    taskSid,
    inputText
  });

  static setAttachment = (taskSid, attachment) => ({
    type: ACTION_SET_CHAT_ATTACHMENT,
    taskSid,
    attachment
  });

  static messageSent = taskSid => ({
    type: ACTION_CHAT_MESSAGE_SENT,
    taskSid
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CHAT_INPUT_TEXT: {
      const { taskSid, inputText } = action;
      return {
        ...state,
        [taskSid]: {
          ...state[taskSid],
          inputText
        }
      };
    }

    case ACTION_SET_CHAT_ATTACHMENT: {
      const { taskSid, attachment } = action;
      return {
        ...state,
        [taskSid]: {
          ...state[taskSid],
          attachment
        }
      };
    }

    case ACTION_CHAT_MESSAGE_SENT: {
      const { taskSid } = action;
      return {
        ...state,
        [taskSid]: {
          inputText: ''
        }
      };
    }

    default:
      return state;
  }
};
