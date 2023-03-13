import { Manager } from '@twilio/flex-ui';
import { ChannelTypes } from '../utils/constants';
import { bindActionCreators } from 'redux';
import { Actions } from '../states/ToolsReducer';
const manager = Manager.getInstance();

function setCurrentTool(taskSid, path) {
  bindActionCreators(Actions.setCurrentTool, manager.store.dispatch)
    .call(null, taskSid, path);
}
class CDTToolMenu {
  afterWrapupTask = (payload, abortFunction) => {
    const { task } = payload;
    let { taskSid } = task;

    // Digital channels tasks will have taskSid, voice tasks have task.sid
    taskSid = taskSid ? taskSid : task.sid;

    const isChat = task.attributes.channelType === ChannelTypes.chat;
    const isVoice = task.attributes.channelType === ChannelTypes.voice;
    const isSms = task.attributes.channelType === ChannelTypes.sms;
    const isEmail = task.attributes.channelType === ChannelTypes.email;
    const isCdtRequired = task.attributes && task.attributes.cdtRequired;
    const isChatOrVoice = isChat || isVoice;

    const shouldOpenDispositionTool = isChatOrVoice || isSms || (isEmail && isCdtRequired);

    if (shouldOpenDispositionTool) {
      const path = '/disposition';
      setCurrentTool(taskSid, path);
    }
  };
}
export default new CDTToolMenu();
