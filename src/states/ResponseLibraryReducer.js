import rabinKarp from '../utils/rabinKarp-search';
const ACTION_RESPONSE_LIBRARY_LOADED = 'RESPONSE_LIBRARY_LOADED';
const ACTION_SLASH_SEARCH_QUERY = 'SLASH_SEARCH_QUERY';
const ACTION_REMOVE_SLASH_MATCH = 'REMOVE_SLASH_MATCH';
const ACTION_CLEAR_SLASH_SEARCH = 'CLEAR_SLASH_SEARCH';
const ACTION_RESPONSE_LIBRARY_QUERY = 'RESPONSE_LIBRARY_QUERY';
const ACTION_REMOVE_RESPONSE_LIBRARY_MATCH = 'REMOVE_RESPONSE_LIBRARY_MATCH';
const ACTION_CLEAR_RESPONSE_LIBRARY_SEARCH = 'CLEAR_RESPONSE_LIBRARY_SEARCH';

const initialState = {
  isLoaded: false,
  responseLibrarySearch: {},
  slashSearch: {},
  data: {
    global: {},
    worker: {},
    frequent: {}
  }
};

export class Actions {
  static responseLibraryLoaded = data => ({
    type: ACTION_RESPONSE_LIBRARY_LOADED,
    data
  });

  static responseLibraryQuery = (task, query, currentTab) => ({
    type: ACTION_RESPONSE_LIBRARY_QUERY,
    task,
    query,
    currentTab
  });

  static removeResponseLibraryMatch = (taskSid, shortCode) => ({
    type: ACTION_REMOVE_RESPONSE_LIBRARY_MATCH,
    taskSid,
    shortCode
  });

  static clearResponseLibrarySearch = taskSid => ({
    type: ACTION_CLEAR_RESPONSE_LIBRARY_SEARCH,
    taskSid
  });

  static slashSearchQuery = (task, slashTriggers) => ({
    type: ACTION_SLASH_SEARCH_QUERY,
    task,
    slashTriggers
  });

  static removeSlashMatch = (taskSid, shortCode) => ({
    type: ACTION_REMOVE_SLASH_MATCH,
    taskSid,
    shortCode
  });

  static clearSlashSearch = taskSid => ({
    type: ACTION_CLEAR_SLASH_SEARCH,
    taskSid
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_RESPONSE_LIBRARY_LOADED: {
      const { global, worker } = action.data;

      const friendlyGlobal = friendlyFormatResponseLibraryData(global);
      const friendlyWorker = friendlyFormatResponseLibraryData(worker);
      const friendlyFrequent = friendlyFormatFrequentResponses(global);

      return {
        ...state,
        isLoaded: true,
        data: {
          global: friendlyGlobal,
          worker: friendlyWorker,
          frequent: friendlyFrequent || []
        }
      };
    }

    case ACTION_RESPONSE_LIBRARY_QUERY: {
      const { task, query, currentTab } = action;
      const { global, worker, frequent } = state.data;
      const { brand } = task.attributes;

      if (query) {
        const matches = getResponseMatches(
          query,
          currentTab === 'global'
            ? global[brand]
            : currentTab === 'frequent'
            ? frequent
            : worker[brand]
        );

        return {
          ...state,
          responseLibrarySearch: {
            ...state.responseLibrarySearch,
            searchQuery: query,
            [task.taskSid]: matches
          }
        };
      } else {
        return {
          ...state,
          responseLibrarySearch: {
            ...state.responseLibrarySearch,
            searchQuery: '',
            [task.taskSid]: []
          }
        };
      }
    }

    case ACTION_REMOVE_RESPONSE_LIBRARY_MATCH: {
      const { taskSid, shortCode } = action;
      let newMatches = { ...state.responseLibrarySearch[taskSid] };
      delete newMatches[shortCode];

      if (Object.keys(newMatches).length > 0) {
        return {
          ...state,
          responseLibrarySearch: {
            ...state.responseLibrarySearch,
            [taskSid]: newMatches
          }
        };
      } else {
        let newResponseLibrarySearch = { ...state.responseLibrarySearch };
        delete newResponseLibrarySearch[taskSid];
        return {
          ...state,
          responseLibrarySearch: {
            ...newResponseLibrarySearch
          }
        };
      }
    }
    case ACTION_CLEAR_RESPONSE_LIBRARY_SEARCH: {
      const { taskSid } = action;
      let newResponseLibrarySearch = { ...state.responseLibrarySearch };
      delete newResponseLibrarySearch[taskSid];

      return {
        ...state,
        responseLibrarySearch: {
          ...newResponseLibrarySearch
        }
      };
    }

    case ACTION_SLASH_SEARCH_QUERY: {
      const { task, slashTriggers } = action;
      const { global, worker } = state.data;
      const { brand } = task.attributes;

      const matches = getTriggerResponseMatches(
        slashTriggers,
        global[brand],
        worker[brand]
      );

      return {
        ...state,
        slashSearch: {
          ...state.slashSearch,
          [task.taskSid]: matches
        }
      };
    }
    case ACTION_REMOVE_SLASH_MATCH: {
      const { taskSid, shortCode } = action;
      let newMatches = { ...state.slashSearch[taskSid] };
      delete newMatches[shortCode];

      if (Object.keys(newMatches).length > 0) {
        return {
          ...state,
          slashSearch: {
            ...state.slashSearch,
            [taskSid]: newMatches
          }
        };
      } else {
        let newSlashSearch = { ...state.slashSearch };
        delete newSlashSearch[taskSid];
        return {
          ...state,
          slashSearch: {
            ...newSlashSearch
          }
        };
      }
    }
    case ACTION_CLEAR_SLASH_SEARCH: {
      const { taskSid } = action;
      let newSlashSearch = { ...state.slashSearch };
      delete newSlashSearch[taskSid];

      return {
        ...state,
        slashSearch: {
          ...newSlashSearch
        }
      };
    }
    default: {
      return state;
    }
  }
};

function friendlyFormatFrequentResponses(global) {
  let friendlyFrequent = [];

  for (const response of global) {
    const { sk } = response;

    if (response.total > 0) {
      const friendlyData = { ...response, shortCode: sk };
      friendlyFrequent.push(friendlyData);
    }
  }

  const friendlySorted = friendlyFrequent.sort((a, b) => {
    return a.total > b.total ? -1 : 1;
  });

  if (friendlySorted.length > 10) {
    friendlySorted.length = 10;
  }

  return friendlySorted;
}

function friendlyFormatResponseLibraryData(data) {
  return data.reduce((processed, response) => {
    const { sk, brand } = response;
    const friendlyData = { ...response, shortCode: sk };
    const includedBrands = brand || [
      'Neiman Marcus',
      'Bergdorf Goodman',
      'Last Call',
      'Horchow'
    ];
    includedBrands.forEach(brand => {
      if (processed[brand]) {
        processed[brand] = [...processed[brand], friendlyData];
      } else {
        processed[brand] = [friendlyData];
      }
    });

    return processed;
  }, {});
}

function getResponseMatches(query, responses) {
  const matches = [];

  responses &&
    responses.length &&
    responses.forEach(response => {
      const fullStringArray = [];

      fullStringArray.push(response.title);
      fullStringArray.push(response.category);
      fullStringArray.push(response.body);

      const fullString = fullStringArray.toString();

      const characterMatches = rabinKarp(
        fullString.toLowerCase(),
        query.toLowerCase()
      );

      if (characterMatches) {
        matches.push({
          characterMatches: characterMatches,
          response: response
        });
      }
    });

  const sorted = matches.sort((a, b) => {
    return a.characterMatches > b.characterMatches ? -1 : 1;
  });

  return sorted;
}

function getTriggerResponseMatches(triggers, globalResponses, workerResponses) {
  return triggers.reduce((matches, trigger) => {
    const { shortCode } = trigger;
    let match = findResponseByShortcode(globalResponses, shortCode);
    if (!match) {
      match = findResponseByShortcode(workerResponses, shortCode);
    }
    if (match) {
      return { ...matches, [shortCode]: match };
    }
    return matches;
  }, {});
}

function findResponseByShortcode(responses, query) {
  return (
    responses &&
    responses.length &&
    responses.find(response => {
      const { shortCode } = response;
      const comparison = shortCode.localeCompare(query, undefined, {
        sensitivity: 'accent'
      });
      return comparison === 0;
    })
  );
}
