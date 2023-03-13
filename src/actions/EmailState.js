import { Manager } from '@twilio/flex-ui';

import { bindActionCreators } from 'redux';
import { Actions } from '../states/EmailReducer';
import { ChannelTypes } from '../utils/constants';

const manager = Manager.getInstance();

class EmailState {
  afterCompleteTask = (payload, abortFunction) => {
    const task = payload.task;

    if (task.attributes.channelType === ChannelTypes.email) {
      const clearEmail = bindActionCreators(
        Actions.clearEmail,
        manager.store.dispatch
      );
      clearEmail(task.taskSid);
    }
  };
}

export default new EmailState();
