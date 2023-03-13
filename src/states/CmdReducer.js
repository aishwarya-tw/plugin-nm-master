const ACTION_SET_CMD_PROFILE = 'ACTION_SET_CMD_PROFILE';
const ACTION_CLEAR_CMD_PROFILE = 'ACTION_CLEAR_CMD_PROFILE';

const initialState = {};

export class Actions {
  static setCmdProfile = ({ taskId, data }) => ({
    type: ACTION_SET_CMD_PROFILE,
    taskId,
    data
  });

  static clearCmdProfile = taskId => ({
    type: ACTION_CLEAR_CMD_PROFILE,
    taskId
  });

}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CMD_PROFILE: {
      const { taskId, data} = action;
      return {
        ...state,
        [taskId]: { ...state[taskId], data }
      };
    }

    case ACTION_CLEAR_CMD_PROFILE: {
      const newState = { ...state };
      console.log('clear CMD Profileeeee 111111 ==>', newState, action)
      delete newState[action.taskId];
      console.log('clear CMD Profileeeee==>', newState)
      return { ...newState };
    }

    default:
      return state;
  }
};
