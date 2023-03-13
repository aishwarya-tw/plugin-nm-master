const GET_AGENTS_DATA = 'GET_AGENTS_DATA';
const initialState = { report: '-' };

export class Actions {
  static getAgentData = report => ({
    type: 'GET_AGENTS_DATA_FULFILLED',
    report: report
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `${GET_AGENTS_DATA}_PENDING`:
      return state;
    case `${GET_AGENTS_DATA}_FULFILLED`:
      return {
        report: action.report
      };
    case `${GET_AGENTS_DATA}_REJECTED`:
      return {
        ...state,
        error: action.payload.error
      };
    default:
      return state;
  }
};
