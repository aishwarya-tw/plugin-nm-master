const ACTION_UPDATE_QUEUES_LIST = 'UPDATE_QUEUES_LIST';

const initialState = {
  queuesList: [],
};

export class Actions {
  static updateAvailableQueues = (queuesList) => ({
    type: ACTION_UPDATE_QUEUES_LIST,
    queuesList,
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_UPDATE_QUEUES_LIST: {
      return {
        ...state,
        queuesList: action.queuesList,
      };
    }
    default: {
      return state;
    }
  }
}