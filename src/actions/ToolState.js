import { Manager } from '@twilio/flex-ui';

import { bindActionCreators } from 'redux';
import { Actions } from '../states/ToolsReducer';

const manager = Manager.getInstance();

class ToolState {
  afterCompleteTask = (payload, abortFunction) => {
    const taskSid = payload.task.taskSid;
    const clearTask = bindActionCreators(
      Actions.clearTask,
      manager.store.dispatch
    );
    clearTask(taskSid);
  };
}

export default new ToolState();
