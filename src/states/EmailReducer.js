const ACTION_SET_EMAIL_SUBJECT = 'SET_EMAIL_SUBJECT';
const ACTION_SET_EMAIL_IN_REPLY_TO = 'SET_EMAIL_IN_REPLY_TO';
const ACTION_SET_EMAIL_BODY = 'SET_EMAIL_BODY';
const ACTION_SET_EMAIL_ATTACHMENT = 'SET_EMAIL_ATTACHMENT';
const ACTION_CLEAR_EMAIL = 'CLEAR_EMAIL';

const initialState = {};

export class Actions {
  static setEmailSubject = (taskSid, subject) => ({
    type: ACTION_SET_EMAIL_SUBJECT,
    taskSid,
    subject
  });

  static setEmailInReplyTo = (taskSid, inReplyTo) => ({
    type: ACTION_SET_EMAIL_IN_REPLY_TO,
    taskSid,
    inReplyTo
  });

  static setEmailBody = (taskSid, body) => ({
    type: ACTION_SET_EMAIL_BODY,
    taskSid,
    body
  });

  static setEmailAttachment = (taskSid, attachment) => ({
    type: ACTION_SET_EMAIL_ATTACHMENT,
    taskSid,
    attachment
  });

  static clearEmail = taskSid => ({
    type: ACTION_CLEAR_EMAIL,
    taskSid
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_EMAIL_SUBJECT: {
      const { taskSid, subject } = action;
      return {
        ...state,
        [taskSid]: { ...state[taskSid], subject }
      };
    }

    case ACTION_SET_EMAIL_IN_REPLY_TO: {
      const { taskSid, inReplyTo } = action;
      return {
        ...state,
        [taskSid]: { ...state[taskSid], inReplyTo }
      };
    }

    case ACTION_SET_EMAIL_BODY: {
      const { taskSid, body } = action;
      return {
        ...state,
        [taskSid]: { ...state[taskSid], body }
      };
    }

    case ACTION_SET_EMAIL_ATTACHMENT: {
      const { taskSid, attachment } = action;
      return {
        ...state,
        [taskSid]: { ...state[taskSid], attachment }
      };
    }

    case ACTION_CLEAR_EMAIL: {
      const newState = { ...state };
      delete newState[action.taskSid];
      return { ...newState };
    }

    default:
      return state;
  }
};
