import { Manager } from '@twilio/flex-ui';

import { bindActionCreators } from 'redux';
import { Actions } from '../states/ResponseLibraryReducer';

const manager = Manager.getInstance();

class SlashSearch {
  afterCompleteTask = (payload, abortFunction) => {
    const taskSid = payload.task.taskSid;
    const clearSearch = bindActionCreators(
      Actions.clearSlashSearch,
      manager.store.dispatch
    );
    clearSearch(taskSid);
  };
}

export default new SlashSearch();
