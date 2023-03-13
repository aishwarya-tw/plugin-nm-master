import { Actions as FlexActions, Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

//class SetConversations {
  const _getChatInit = (isAgent1, transfer) => {
    let agent2Init = (transfer && transfer.fromWorkerSID) ? transfer.fromWorkerSID:null;
    let init = (isAgent1)?"Customer":agent2Init;
    return init;
  };

  const _getChatQueueName = (isAgent1, transfer, currentQueueName, transferTargetType) => {
    let fromQueue = (transfer && transfer.fromQueue)? transfer.fromQueue:null;
    if (transferTargetType === "queue"){
      return currentQueueName;
    }else {
      return ((isAgent1)?currentQueueName:fromQueue); //worker transfer, take agent1's queue name
    }
  }

  const _getChatDestination = (isAgent1, transfer, transferTargetType)=>{
    let result = null;
    if (isAgent1){
      if (transfer && transfer.status==="success"){
        if ((transferTargetType === "queue") && transfer.destination){
          result = transfer.destination;
        } else if (transfer.destWorkerSid){
          result = transfer.destWorkerSid;
        }
      }
    }
    return result;
  }

  const _getChatSource = (isAgent1, transfer, transferTargetType) => {
    let result = null;
    if (!isAgent1){
      if (transfer && (transfer.status === "success")){
        result = (transferTargetType === "queue")? transfer.fromQueue: transfer.fromWorkerSID;
      }
    }
    return result;
  }

  const _getChatFollowBy = (isAgent1, transfer, transferTargetType)=>{
    let result = null;
    if (isAgent1 && transferTargetType && transfer && (transfer.status === "success")){
      if (transferTargetType === "queue"){
        result = "COLD:QUEUE:complete";
      }else {
        result = "COLD:WORKER:complete";
      }
    }
    return result;
  }

  const _getChatPreBy = (isAgent1, transfer, transferTargetType)=>{
    let result = null;
    if (!isAgent1 && transferTargetType && transfer && (transfer.status === "success")){
      if (transferTargetType === "queue"){
        result = "COLD:QUEUE:complete";
      }else {
        result = "COLD:WORKER:complete";
      }
    }
    return result;
  }


export async function setConversations(task, DispositionSurvey){
  console.log("setConversations task:",task);
  console.log("setConversations Disposition:",DispositionSurvey);

  let attribute5=null;
  let attribute6=null;
  if ((DispositionSurvey) && (DispositionSurvey.selectedRecord)){
      attribute5 = (DispositionSurvey.selectedRecord.category)?DispositionSurvey.selectedRecord.category: null;
      attribute6 = (DispositionSurvey.selectedRecord.subcategory)?DispositionSurvey.selectedRecord.subcategory: null;
    } 

  
  let { transfer = {} } = task.attributes;
  let workerSid = manager.workerClient.sid;
  console.log("setConversations transfer:", transfer);

  let isTransfer = (Object.keys(transfer).length>0) ? true:false;
  let dbmsg = (isTransfer)?"is transfer ":"";

  //transferred chat task
  //console.log("inside transfer!!!");
  let isAgent1 = (transfer && transfer.status==="success" && transfer.fromWorkerSID && (workerSid !== transfer.fromWorkerSID))?false:true;
  dbmsg += (isAgent1)?"Agent 1":"Agent 2";
  console.log("setConversations:"+dbmsg);
  if (isAgent1){
    console.log("setConversations agent 1:"+workerSid+" "+transfer.fromWorkerSID);
  }
  let currentQueueName = task.queueName;
  
  
  let transferTargetType = null;
  if (task.attributes && transfer && transfer.status==="success" && (transfer.destWorkerSid.length>0)){
    transferTargetType=(transfer.destWorkerSid.startsWith('WK'))?'worker':'queue';
  
  }

  let updateConv = {};

  if (task.taskChannelUniqueName === 'chat') {

    let externalContact = ((task.attributes.isPlatinum) && (task.attributes.isPlatinum === 'true')) ?
      'NM Mobile App' : 'Neiman Marcus --';
    let deviceType = (task.attributes.deviceType) ? task.attributes.deviceType : null;
    updateConv = {
      conversation_attribute_1: task.sid,
      conversation_label_1: task.sid,
      conversation_attribute_5: attribute5,
      conversation_attribute_6: attribute6,
      conversation_attribute_8: deviceType,
      conversation_id: task.sid,
      external_contact: externalContact,
      followed_by: (isTransfer) ? _getChatFollowBy(isAgent1, transfer, transferTargetType) : null,
      destination: (isTransfer) ? _getChatDestination(isAgent1, transfer, transferTargetType) : null,
      initiated_by: (isTransfer) ? _getChatInit(isAgent1, transfer) : "Customer",
      preceded_by: (isTransfer) ? _getChatPreBy(isAgent1, transfer, transferTargetType) : null,
      source: (isTransfer) ? _getChatSource(isAgent1, transfer, transferTargetType) : null,
      queue: (isTransfer) ? _getChatQueueName(isAgent1, transfer, currentQueueName, transferTargetType) : currentQueueName
    }

  } else {
    updateConv = {
      conversation_attribute_1: task.sid,
      conversation_label_1: task.sid,
      conversation_attribute_5: attribute5,
      conversation_attribute_6: attribute6,
      conversation_id: task.sid,
      followed_by: (isTransfer) ? _getChatFollowBy(isAgent1, transfer, transferTargetType) : null,
      destination: (isTransfer) ? _getChatDestination(isAgent1, transfer, transferTargetType) : null,
      initiated_by: (isTransfer) ? _getChatInit(isAgent1, transfer) : "Customer",
      preceded_by: (isTransfer) ? _getChatPreBy(isAgent1, transfer, transferTargetType) : null,
      source: (isTransfer) ? _getChatSource(isAgent1, transfer, transferTargetType) : null,
      queue: (isTransfer) ? _getChatQueueName(isAgent1, transfer, currentQueueName, transferTargetType) : currentQueueName
    }
  }


  let updateAttr = (DispositionSurvey) ? 
      {...task.attributes,
        DispositionSurvey,
        conversations: {
          ...task.attributes.conversations,
          ...updateConv
        }
        } :
      {...task.attributes,
        conversations: {
          ...task.attributes.conversations,
          ...updateConv
        }
      };

  if (DispositionSurvey){
      let transferStatus = task.attributes?.transfer?.status || "none";
      let fromWorkerSID =  task.attributes?.transfer?.fromWorkerSID || "none";
      console.log("setConversations: transferStatus ",transferStatus);
      console.log("setConversations: fromWrokerSid ",fromWorkerSID+" "+workerSid);
      if ((task.taskChannelUniqueName === 'chat') &&
          (transferStatus === 'success') &&
          (workerSid === fromWorkerSID)){
          console.log("delete channelsid!!!");
          //delete channel sid to avoid Twilio default chat orchestration for agent 1  
          delete updateAttr.channelSid;
      }  
    }    
  console.log("setConversations: updateAttr:", updateAttr);

  task
    .setAttributes({...updateAttr})
    .then(() => {
      if (DispositionSurvey) {
        FlexActions.invokeAction('CompleteTask', {sid: task.reservationSid});
      }
    })
    .catch((error)=>console.log(error));
  
}