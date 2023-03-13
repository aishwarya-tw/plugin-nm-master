const ACTION_UPDATE_QUEUES_FILTER = 'UPDATE_QUEUES_FILTER';

const initialState = {
  selectedFilter: "All",
};

export class Actions {
  static updateQueuesFilter = (newFilter) => ({
    type: ACTION_UPDATE_QUEUES_FILTER,
    newFilter,
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_UPDATE_QUEUES_FILTER: {
      return {
        ...state,
        selectedFilter: action.newFilter,
      };
    }
    default: {
      return state;
    }
  }
}