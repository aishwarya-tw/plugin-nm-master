import { Manager, TaskHelper } from '@twilio/flex-ui';
import { bindActionCreators } from 'redux';
import { Actions as ToolActions } from '../states/ToolsReducer';
import { Actions as ChatActions } from '../states/ChatTransferReducer';

const manager = Manager.getInstance();

class TransferChat {
  showTransferDetails = (payload) => {
    const { task } = payload;

    if (task && TaskHelper.isChatBasedTask(task) && task.attributes.transfer && task.status !== 'wrapping') {
      const setCurrentTool = bindActionCreators(
        ToolActions.setCurrentTool,
        manager.store.dispatch
      );

      setCurrentTool(task.taskSid, '/transfer-details');
    }
  };

  afterCompleteTask = (payload) => {
    const { task } = payload;

    if (task && TaskHelper.isChatBasedTask(task) && task.attributes.transfer) {
      const clearMessages = bindActionCreators(
        ChatActions.clearMessages,
        manager.store.dispatch
      );

      clearMessages(task.taskSid);
    }
  };
}

export default new TransferChat();