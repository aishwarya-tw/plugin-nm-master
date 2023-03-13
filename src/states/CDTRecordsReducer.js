const ACTION_CDT_RECORDS_LOADED = 'CDT_RECORDS_LOADED';

const initialState = [];

export class Actions {
  static cdtRecordsLoaded = cdtRecords => ({
    type: ACTION_CDT_RECORDS_LOADED,
    cdtRecords
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CDT_RECORDS_LOADED: {
      return [...action.cdtRecords];
    }
    default:
      return state;
  }
};
