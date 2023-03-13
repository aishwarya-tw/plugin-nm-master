export const REDUX_NAMESPACE = 'configuration';

const SET_CONFIG = 'SET_CONFIG';
const SET_DISABLED = 'SET_DISABLED';

const initialState = {
  defaultConfig: null,
  queues: null,
  showDisabled: false
};

export class Actions {
  static setConfig = (defaultConfig, queues) => {
    // ARG - treat some configuration properties as "global".
    // Not clear what we really want to do but for now prevents issues
    // where toggling value in the default config is not reflected in queue config.
    // Just avoid propagating to queue configs.
    const pluckedConfig = defaultConfig;
    delete pluckedConfig.askRefreshIntervalInSeconds;
    delete pluckedConfig.useTaskRouterStats;
    return {
      type: SET_CONFIG,
      pluckedConfig,
      queues
    };
  };

  static showDisabled = showDisabled => ({
    type: SET_DISABLED,
    showDisabled
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIG: {
      const stuff = {
        ...state,
        defaultConfig: action.pluckedConfig,
        queues: action.queues
      };

      return stuff;
    }
    case SET_DISABLED: {
      return {
        ...state,
        showDisabled: action.showDisabled
      };
    }

    default:
      return state;
  }
};
