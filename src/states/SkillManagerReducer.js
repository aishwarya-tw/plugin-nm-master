import produce from 'immer';
import { Manager } from '@twilio/flex-ui';
import { BPOProviders, Channels } from '../utils/constants';

const ACTION_UPDATE_TEAM_MANAGERS = 'UPDATE_TEAM_MANAGERS';
const ACTION_UPDATE_OPS_MANAGERS = 'UPDATE_OPS_MANAGERS';
const ACTION_CLEAR_FILTERS = 'CLEAR_FILTERS';
const ACTION_UPDATE_SKILLS = 'UPDATE_SKILLS';
const ACTION_RESET_SKILLS = 'RESET_SKILLS';
const ACTION_UPDATE_WORKERS = 'UPDATE_WORKERS';
const ACTION_UPDATE_WORKER_SELECTION = 'UPDATE_WORKER_SELECTION';
const ACTION_SELECT_ALL_WORKERS = 'SELECT_ALL_WORKERS';
const ACTION_UPDATE_FILTER_SELECTIONS = 'UPDATE_FILTER_SELECTIONS';
const ACTION_UPDATE_STATE = 'UPDATE_STATE';
const ACTION_UPDATE_ATTRIBUTES = 'UPDATE_ATTRIBUTES';
const ACTION_UPDATE_CAPACITIES = 'UPDATE_CAPACITIES';

const getSkillList = () => {
  let manager = Manager.getInstance();
  const { taskrouter_skills } = manager.serviceConfiguration;
  const skills = taskrouter_skills
    .map(skill => skill.name)
    .filter(skill => !Channels.includes(skill))
    .sort((a, b) => a.localeCompare(b));
  return skills;
};

const initSkillManager = () => {
  const skills = getSkillList();
  let skillManager = {};
  skills.forEach(skill => skillManager[skill] = { update: false, value: false });
  return skillManager;
};

const initialState = {
  filters: {
    teamManager: {
      data: [],
      selection: [],
    },
    opsManager: {
      data: [],
      selection: [],
    },
    bpoProvider: {
      data: BPOProviders,
      selection: [],
    },
    channel: {
      data: Channels,
      selection: [],
    },
    skill: {
      data: getSkillList(),
      selection: [],
    },
  },
  workers: [],
  selectedWorkers: [],
  skillManager: initSkillManager(),
  attributeManager: { isTeamManager: "", teamManager: "", bpoProvider: "", isOpsManager: "", opsManager: "" },
  isLoading: false,
  isError: false,
  message: 'Please perform a search for workers.',
  isSearchDisabled: true,
  isFilterDisabled: false,
  capacities: {},
}

export class Actions {
  static updateTeamManagers = data => ({
    type: ACTION_UPDATE_TEAM_MANAGERS,
    data
  });

  static updateOpsManagers = data => ({
    type: ACTION_UPDATE_OPS_MANAGERS,
    data
  });

  static updateFilterSelection = data => ({
    type: ACTION_UPDATE_FILTER_SELECTIONS,
    data
  });

  static selectAllWorkers = () => ({
    type: ACTION_SELECT_ALL_WORKERS,
  });

  static clearFilters = () => ({
    type: ACTION_CLEAR_FILTERS,
  });

  static updateWorkers = data => ({
    type: ACTION_UPDATE_WORKERS,
    data
  });

  static updateWorkerSelection = data => ({
    type: ACTION_UPDATE_WORKER_SELECTION,
    data
  });

  static updateSkills = data => ({
    type: ACTION_UPDATE_SKILLS,
    data
  });

  static resetSkills = () => ({
    type: ACTION_RESET_SKILLS
  });

  static updateState = data => ({
    type: ACTION_UPDATE_STATE,
    data
  });

  static updateAttributes = data => ({
    type: ACTION_UPDATE_ATTRIBUTES,
    data
  });
  static bulkUpdateCapacities = data => ({
    type: ACTION_UPDATE_CAPACITIES,
    data
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_UPDATE_TEAM_MANAGERS: {
      return produce(state, (draftState) => {
        draftState.filters.teamManager.data = action.data
      });
    }
    case ACTION_UPDATE_OPS_MANAGERS: {
      return produce(state, (draftState) => {
        draftState.filters.opsManager.data = action.data
      });
    }
    case ACTION_UPDATE_FILTER_SELECTIONS: {
      const { filter, value } = action.data;
      const nextState = produce(state, (draftState) => {
        draftState.filters[filter].selection = value;
      });
      return {
        ...nextState,
        isSearchDisabled: isSelectionEmpty(nextState.filters),
      };
    }
    case ACTION_CLEAR_FILTERS: {
      return produce(state, (draftState) => {
        Object.keys(draftState.filters).forEach((filter) => {
          draftState.filters[filter].selection = [];
          draftState.isSearchDisabled = true;
        })
      });
    }
    case ACTION_UPDATE_WORKERS: {
      return {
        ...state,
        workers: action.data,
        selectedWorkers: [],
        skillManager: initSkillManager(),
        attributeManager: { isTeamManager: "", teamManager: "", bpoProvider: "", isOpsManager: "", opsManager: "" },
      }
    }
    case ACTION_UPDATE_WORKER_SELECTION: {
      const { sid } = action.data;
      const index = state.selectedWorkers.indexOf(sid);
      return produce(state, (draftState) => {
        if (index > -1) {
          draftState.selectedWorkers.splice(index, 1);
        } else {
          draftState.selectedWorkers.push(sid);
        }
      });
    }
    case ACTION_SELECT_ALL_WORKERS: {
      const { workers, selectedWorkers } = state;
      return produce(state, (draftState) => {
        if (selectedWorkers.length !== workers.length) {
          draftState.selectedWorkers = workers.map(worker => worker.sid);
        } else {
          draftState.selectedWorkers = [];
        }
      });
    }
    case ACTION_UPDATE_SKILLS: {
      const { skill, newValue } = action.data;
      if (newValue.value && !state.skillManager[skill].value) {
        newValue.update = true;
      }
      if (!newValue.update) {
        newValue.value = false;
      }
      return produce(state, (draftState) => {
        draftState.skillManager[skill] = newValue
      });
    }
    case ACTION_RESET_SKILLS: {
      return produce(state, (draftState) => {
        draftState.skillManager = initSkillManager()
      });
    }
    case ACTION_UPDATE_STATE: {
      const { loading, error, message, updating } = action.data;
      return {
        ...state,
        isLoading: loading,
        isError: error,
        message: message,
        isFilterDisabled: updating ? updating : false,
      };
    }
    case ACTION_UPDATE_ATTRIBUTES: {
      const { property, value } = action.data;
      return produce(state, (draftState) => {
        draftState.attributeManager[property] = value
      });
    }
    case ACTION_UPDATE_CAPACITIES: {
      return {
        ...state,
        capacities: action.data,
      }
    }
    default: {
      return state;
    }
  }
};

const isSelectionEmpty = (filters) => {
  return Object.entries(filters).every(filter => filter[1].selection.length === 0);
}