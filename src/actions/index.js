/*
 * import an action handler which includes functions for Flex actions
 * and register listeners by setting the callback to the action handler function
 *
 * import ExampleActionHandler from './ExampleActionHandler';
 * Actions.addListener('beforeAcceptTask', ExampleActionHandler.beforeAcceptTask);
 */

import { Actions, Manager, ChatOrchestrator } from '@twilio/flex-ui';
import ToolState from './ToolState';
import EmailState from './EmailState';
import SaveWorkerSid from './SaveWorkerSid';
import GetCMDData from './GetCMDData';
import Postpone from './Postpone';
import TaskTimeout from './TaskTimeout';
import SlashSearch from './SlashSearch';
import ResponseLibrarySearch from './ResponseLibrarySearch';
import ConferenceService from '../services/ConferenceService';
import ExternalWarmTransfer from './ExternalWarmTransfer';
import { bindActionCreators } from 'redux';
import { Actions as stoteActions } from '../states/CmdReducer';
import AvailableQueues from './AvailableQueues';
import TransferChat from './TransferChat';
import { fetchCDTRecords } from '../init/DataRetrieval';
import { REDUX_NAMESPACE } from '../../src/utils/constants';

const manager = Manager.getInstance();

Actions.addListener(
  'afterCompleteTask',
  ResponseLibrarySearch.afterCompleteTask
);
Actions.addListener('afterCompleteTask', SlashSearch.afterCompleteTask);
Actions.addListener('afterCompleteTask', ToolState.afterCompleteTask);
Actions.addListener('afterCompleteTask', EmailState.afterCompleteTask);
Actions.addListener('afterCompleteTask', TransferChat.afterCompleteTask);
Actions.addListener('afterCompleteTask', async (payload) => {
  console.log('Task ended')

  const clearCmdProfile = bindActionCreators(
    stoteActions.clearCmdProfile,
    manager.store.dispatch
  );
  clearCmdProfile(payload.task._task.sid);

});
// Actions.addListener('afterWrapupTask', CDTToolMenu.afterWrapupTask); // This event only fires for digital channels, so we built a solution in '../events' that handles all channels, making this action redundant
Actions.addListener("afterHangupCall", async (payload) => {
  console.log("hangup: ", payload.task);
  localStorage.setItem('HangUp', 'true');
});

// dummy commit rebuild trigger
Actions.addListener('afterAcceptTask', SaveWorkerSid.afterAcceptTask);

Actions.addListener('afterAcceptTask', async (payload) => {
  console.log("afterAcceptTask GetCMDData Task accepted", payload);
  Actions.invokeAction('SelectTask', {sid: payload.sid });

  GetCMDData.afterAcceptTask(payload);
});

Actions.registerAction('PostponeTask', Postpone.PosptoneTask);
Actions.registerAction('ResumeTask', Postpone.ResumeTask);
Actions.registerAction('TaskTimedOut', TaskTimeout.TimedOut);

Actions.replaceAction('HoldParticipant', async (payload, original) => {
  await ExternalWarmTransfer.toggleHold(payload, original, true);
  return;
});

Actions.replaceAction('UnholdParticipant', async (payload, original) => {
  await ExternalWarmTransfer.toggleHold(payload, original, false);
  return;
});

Actions.replaceAction('KickParticipant', async (payload, original) => {
  const { task, participant } = payload;
  const { participantType, callSid, workerSid } = participant;

  if (participantType === 'worker') {
    return original({task, targetSid: workerSid});
  }

  const conference = task.attributes.conference.sid;

  console.log(`Removing participant ${callSid} from conference`);
  await ConferenceService.removeParticipant(conference, callSid);
  return;
});

Actions.addListener('beforeShowDirectory', AvailableQueues.updateQueuesList);

Actions.addListener('afterSelectTask', TransferChat.showTransferDetails);
Actions.addListener('afterSelectTask', (payload) => {
  if(payload && payload.task) {
    const { task } = payload;
    const { targetQueue } = task.attributes;
    fetchCDTRecords(manager, (targetQueue === 'Stanley') ? targetQueue : task.queueSid);
  }
});

Actions.addListener('afterKickParticipant', async (payload) => {
  let type = (payload?.participant?._source?.participant_type)? payload.participant._source.participant_type : null;
  if (!type){
    type = (payload?.participantType)? payload.participantType : null; 
  }
  if (type && type == 'customer') {
    localStorage.setItem("HangUp", "true");
  }
});

Actions.addListener('beforeStartOutboundCall', (payload) => {
  const { phoneNumber } = manager.store.getState()[REDUX_NAMESPACE].personalNumber
  if (phoneNumber) {
    payload.callerId = phoneNumber;
  }
});

Actions.addListener('beforeCompleteTask',async (payload, original) =>{  
  const {task} = payload;
  console.log("about to restore default chat orchestration!!!");
  let transferStatus = task.attributes?.transfer?.status || "none";
  if ((task.taskChannelUniqueName === 'chat') && (transferStatus === "success")){
    ChatOrchestrator.setOrchestrations('wrapup', ['DeactivateChatChannel']);
  }
});

//CCC-2288 Prints the Digits dialed in the Dialpad to the console
Actions.addListener('afterSetDTMFDialpadDigits', async (payload)=> {
  console.log("Store Extension Dialed: " + payload.digits);
  const {task=null} = payload;
  const {conference={}} = task;
  const {participants=[]} = conference;
  if (Array.isArray(participants) && participants.length > 2) {
    let callSid="";
    for(const val of participants) {
      if (val.participantType === 'unknown'){
        //only for external calls
        callSid=val._callSid;
      }
    }
    if (callSid.length>0){
      console.log("about to call udpate", callSid+" "+payload.digits)
      await ConferenceService.updateExternalCallTask(callSid, payload.digits);
    }
  }
});

Actions.addListener('afterTransferTask',async (payload) =>{    
  const {options=null} = payload;
  if (options && options.mode==='WARM'){
    //resert previous follow_by and destination
    console.log("afterTransferTask WARM");
    localStorage.removeItem('followedBy');
    localStorage.removeItem('toPlace');
  }
});
