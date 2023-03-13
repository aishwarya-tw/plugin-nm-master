const ACTION_AGENT_CONNECTIVITY_DISCONNECTED =
  'AGENT_CONNECTIVITY_DISCONNECTED';
const ACTION_AGENT_CONNECTIVITY_REGAINED = 'AGENT_CONNECTIVITY_REGAINED';

const initialState = {};

export class Actions {
  static agentConnectivityDisconnected = disconnectedMoment => ({
    type: ACTION_AGENT_CONNECTIVITY_DISCONNECTED,
    disconnectedMoment
  });

  static agentConnectivityRegained = nowMoment => ({
    type: ACTION_AGENT_CONNECTIVITY_REGAINED
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_AGENT_CONNECTIVITY_DISCONNECTED: {
      return {
        ...state,
        disconnections: [{ time: action.disconnectedMoment }]
      };
    }

    case ACTION_AGENT_CONNECTIVITY_REGAINED: {
      if (state && state.disconnections && state.disconnections.length > 0) {
        window.location.reload();
      }

      return {
        ...state,
        disconnections: []
      };
    }
    default:
      return state;
  }
};
