const ACTION_ADD_TASK_STATUS_INDICATOR = 'ADD_TASK_STATUS_INDICATOR';
const ACTION_REMOVE_TASK_STATUS_INDICATOR = 'REMOVE_TASK_STATUS_INDICATOR';
const ACTION_CLEAR_ALL_TASK_STATUS_INDICATORS= 'CLEAR_ALL_TASK_STATUS_INDICATORS';

const initialState = {};

export class Actions {
  static addTaskStatusIndicator = (taskSid, indicatorType) => ({
    type: ACTION_ADD_TASK_STATUS_INDICATOR,
    taskSid,
    indicatorType
  });

  static removeTaskStatusIndicator = (taskSid) => ({
    type: ACTION_REMOVE_TASK_STATUS_INDICATOR,
    taskSid
  });

  static clearAllTaskStatusIndicators = () => ({
    type: ACTION_CLEAR_ALL_TASK_STATUS_INDICATORS
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_ADD_TASK_STATUS_INDICATOR: {
      const { taskSid, indicatorType } = action;
      return {
        ...state,
        [taskSid]: { ...state[taskSid], indicatorType }
      };
    }

    case ACTION_REMOVE_TASK_STATUS_INDICATOR: {
      const { taskSid } = action;
      const newState = { ...state };
      delete newState[taskSid];
      return { ...newState };
    }

    case ACTION_CLEAR_ALL_TASK_STATUS_INDICATORS: {
      return {};
    }

    default:
      return state;
  }
};
