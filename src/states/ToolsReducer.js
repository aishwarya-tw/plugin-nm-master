import { INITIAL_TOOL, TOOLS } from '../utils/constants';

const ACTION_SET_CURRENT_TOOL = 'SET_CURRENT_TOOL';
const ACTION_SHOW_TOOLS_MENU = 'SHOW_TOOLS_MENU';
const ACTION_SET_TOOL_STATE = 'SET_TOOL_STATE';
const ACTION_CLEAR_TASK = 'CLEAR_TASK';

const initialState = {};
const initialTask = {
  currentTool: INITIAL_TOOL
};

export class Actions {
  static setCurrentTool = (taskSid, toolPath) => ({
    type: ACTION_SET_CURRENT_TOOL,
    taskSid,
    toolPath
  });

  static showToolsMenu = taskSid => ({
    type: ACTION_SHOW_TOOLS_MENU,
    taskSid
  });

  static setToolState = (taskSid, toolName, toolState) => ({
    type: ACTION_SET_TOOL_STATE,
    taskSid,
    toolName,
    toolState
  });

  static clearTask = taskSid => ({
    type: ACTION_CLEAR_TASK,
    taskSid
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CURRENT_TOOL: {
      const { taskSid, toolPath } = action;
      let task = { ...(state[taskSid] || initialTask) };
      task.currentTool = toolPath;

      return {
        ...state,
        [taskSid]: task
      };
    }

    case ACTION_SHOW_TOOLS_MENU: {
      const { taskSid } = action;
      let task = { ...(state[taskSid] || initialTask) };

      const toolMenu = TOOLS.find(tool => tool.isMenu);
      task.currentTool = toolMenu.path;

      return {
        ...state,
        [taskSid]: task
      };
    }

    case ACTION_SET_TOOL_STATE: {
      const { taskSid, toolName, toolState } = action;

      let task = { ...(state[taskSid] || initialTask) };

      task[toolName] = toolState;

      state[taskSid] = task;
      return {
        [taskSid]: task,
        ...state,
      };
    }

    case ACTION_CLEAR_TASK: {
      const newState = { ...state };
      delete newState[action.taskSid];
      return { ...newState };
    }

    default:
      return state;
  }
};
