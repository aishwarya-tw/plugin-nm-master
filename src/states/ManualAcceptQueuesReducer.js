const ACTION_QUEUES_LOADED = 'QUEUES_LOADED';

const initialState = {
  queues: [],
  retries: 0,
};

export class Actions {
  static loadQueues = data => ({
    type: ACTION_QUEUES_LOADED,
    data
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_QUEUES_LOADED: {
      const { queues, retries } = action.data;
      return {
        ...state,
        queues,
        retries
      };
    }
    default: {
      return state;
    }
  }
};