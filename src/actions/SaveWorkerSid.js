import { Manager } from '@twilio/flex-ui';
import { ChannelTypes } from '../utils/constants';

class SaveWorkerSid {
  afterAcceptTask = (payload, abortFunction) => {
    const task = payload.task;
    const manager = Manager.getInstance();

    if (task && task.attributes.channelType === ChannelTypes.email) {
      task.setAttributes({
        ...task.attributes,
        workerSid: manager.workerClient.sid
      });
    }
  };
}

export default new SaveWorkerSid();
