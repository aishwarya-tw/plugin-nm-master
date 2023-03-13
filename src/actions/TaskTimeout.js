import { Manager } from '@twilio/flex-ui';
import { bindActionCreators } from 'redux';
import { Actions } from '../states/ResponseLibraryReducer';

const manager = Manager.getInstance();

class TaskTimeout {
  TimedOut = payload => {
    const { taskSid } = payload.task;
    const clearSearch = bindActionCreators(
      Actions.clearSlashSearch,
      manager.store.dispatch
    );
    clearSearch(taskSid);
  };
}

export default new TaskTimeout();
