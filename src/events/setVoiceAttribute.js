import { Actions as FlexActions, Manager } from '@twilio/flex-ui';
let manager = Manager.getInstance();

export function notMissingDispositionData (DispositionSurvey) {
    
    if (!DispositionSurvey.customer || !DispositionSurvey.customer.name||
    !DispositionSurvey.customer.email ||
    !DispositionSurvey.tags ||
    !DispositionSurvey.tags.length ||
    !DispositionSurvey.tags[0].category){
        return false;
    }
    return true;
    
  };

function _getTypeBy (transferDescriptor) {
  console.log("getTypeBy setVoiceAttribute:", transferDescriptor);
  if ((transferDescriptor) && (transferDescriptor.mode) && (transferDescriptor.type) && (transferDescriptor.status)) {
    return transferDescriptor.mode + ":" + transferDescriptor.type + ":" + transferDescriptor.status;
  } else {
    return null;
  }
}

async function _getDestination (transferDescriptor) {
  console.log("getDestination setVoiceAttribute:", transferDescriptor);
                      
  if (transferDescriptor && transferDescriptor.type){
    switch (transferDescriptor.type) {
      case "QUEUE": {
        if ((transferDescriptor.queue) && (transferDescriptor.queue.name)){
          return transferDescriptor.queue.name;
        }else if (transferDescriptor.to){
          console.log(" setVoiceAttribute:getting queue name from liveQuery");
          let queueSid = transferDescriptor.to;
          console.log(" setVoiceAttribute:", queueSid);

          let response = await manager.insightsClient.liveQuery(
            'tr-queue',
            `data.queue_sid in ["${queueSid}"]`);  
          let items = response.getItems();
          let names = (items) ? Object.values(items).map(member => member.queue_name):[];
          let ret = (names.length>0)? names[0]:null;
          return ret;
        }
      }
      case "WORKER": return transferDescriptor.to;
      default: return null;
    }
  }
  return null;
    
}

  
function _getQueueName (task, outgoing) {
    let currentQueueName = localStorage.getItem('CurrentQueueName') || task.queueName;
    console.log('current Queue Name',currentQueueName);
    if (outgoing){
      //find original queueName by workersid
      const { sourceQueues = [] } = task.attributes;
      let obj = sourceQueues.find(q => q.workersid === task._worker.sid);
      currentQueueName = obj ? obj.queueName : currentQueueName; 
    }
    return currentQueueName;
  }

function _getSource (task, incoming) {
  //let currentQueueName = localStorage.getItem('CurrentQueueName') || task.queueName;
  if (incoming){
    //find original queueName by workersid
    const sourceAgentSid = incoming.workerSid||null;
    const sourceType = incoming.type||null;
    
    if (sourceType === 'QUEUE'){
      const { sourceQueues = [] } = task.attributes;
      let obj = sourceQueues.find(q => q.workersid === sourceAgentSid);
      return (obj ? obj.queueName : null);
    }
    return sourceAgentSid; 
  }
  return null;
}  

function _getInitiatedby (task) {
  if ((task.transfers) && (task.transfers.incoming))
    return task.transfers.incoming.workerSid;
  if ((task.attributes.direction) && (task.attributes.direction === 'inbound')) {
    return "Customer";
  }
  if ((task.attributes.direction) && (task.attributes.direction === 'outbound')) {
    return task._worker.sid;
  }
  return null;
};

function _getHangUpBy (task){
  const hangUp = localStorage.getItem('HangUp');
  let hang_up_by = (hangUp && hangUp=='true')?'Agent':'Customer';
  if ((task.transfers) && (task.transfers.outgoing) && (task.transfers.outgoing.mode === "COLD")){
    hang_up_by="Agent";
  }
  
  console.log("final hang_up_by setVoiceAttribute:", hang_up_by);
  return hang_up_by;
}

function _getAgentCallSid(task, incoming){
  let attribute4=null;
  if (incoming && incoming.mode){
      //not the first agent, must find call sid from segments
      if (task.attributes.segments){
        const { callSid = null } = task.attributes.segments.find(
            segment => segment.workerSid === task._worker.sid
          );  
        console.log("getting callSid from segments setVoiceAttribute:", callSid)  
        attribute4 = (callSid)? callSid:null;  
        
      }
  } else {
     attribute4 = (task?.attributes?.conference?.participants?.worker)? task.attributes.conference.participants.worker:null;   
  }  

  if (!attribute4){
    //get it from local storage as last resort
    attribute4 = localStorage.getItem("AgentCallSid");
  }

  return attribute4;

}

function _getSeg(workerSid, agentCallSid, workerContactUri, startDateTime){
  console.log("getSeg setVoiceAttribute:");
  let start = new Date(startDateTime);
  let end = new Date();
  let duration = Math.abs(Math.ceil((end.getTime() -start.getTime())/1000));
  let newSeg = {
    "callSid": agentCallSid,
    "contactUri": workerContactUri,
    "startDateTime": startDateTime,
    "endDateTime": end.toISOString(),
    "duration": duration,
    "workerSid": workerSid
  }
  return newSeg;

}
function _fillDuration(curSeg=[], workerSid, agentCallSid, workerContactUri, startDateTime){
 
  let found = false;
  for (let i=0; i < curSeg.length; i++) {
    console.log("in loop setVoiceAttribute:", curSeg[i]);
    if (curSeg[i].workerSid && curSeg[i].workerSid==workerSid){
      found = true;
      if (!curSeg[i].duration){
        //cualculate duration
        console.log("filling in duration setVoiceAttribute:");
        let start = new Date(curSeg[i].startDateTime);
        let end = new Date();
        curSeg[i].duration = Math.abs(Math.ceil((end.getTime() -start.getTime())/1000));
        curSeg[i].endDateTime = end.toISOString();
      }
    }
  } 
  if (!found){
    //segment missing
    console.log("seg missing setVoiceAttribute:");
    
    let newSeg = _getSeg(workerSid, agentCallSid, workerContactUri, startDateTime);
    console.log('newSeg in getDuration setVoiceAttribute:', newSeg);
    curSeg.push(newSeg);
  }
  
}
  

export async function setVoiceAttributes(task, DispositionSurvey, reservationSid){ 
  console.log("task setVoiceAttribute:", task);
  console.log("disposition setVoiceAttribute:", DispositionSurvey);
  console.log("segments setVoiceAttribute:", task.attributes.segments);
  
  let attribute3 = null;
  let attribute4 = null;
  let attribute5 = null;
  let attribute6 = null;
  let outgoing = null;
  let incoming = null;
  let newSegArr=[];

  if ((task.taskChannelUniqueName === 'voice') &&
        (task.attributes)){

    outgoing = (task?.transfers?.outgoing) ? {...task.transfers.outgoing} : null;
    if (!outgoing){
      outgoing = (task?.outgoingTransferDescriptor)? {...task.outgingTransferDescriptor}:null;
    }
    incoming = (task?.transfers?.incoming) ? {...task.transfers.incoming}:null;
    if (!incoming){
      incoming = (task?.incomingTransferDescriptor)? {...task.incomingTransferDescriptor}:null;
    }
    console.log("outgoing setVoiceAttribute:",outgoing);
    console.log("incoming setVoiceAttribute:",incoming);
    
    if (task.attributes.segments){
       _fillDuration(task.attributes.segments, task._worker.sid, attribute4, task._worker.attributes.contact_uri, task.attributes.taskDateAccepted);
    }else {
      let newSeg = _getSeg(task._worker.sid, attribute4, task._worker.attributes.contact_uri, task.attributes.taskDateAccepted);
      newSegArr.push(newSeg);
    }
    
    attribute3 = (task?.attributes?.conference?.sid)? task.attributes.conference.sid:null;
    attribute4 = _getAgentCallSid(task, incoming);    
    console.log("attribute3 setVoiceAttribute:", attribute3);
    console.log("attribute4 setVoiceAttribute:", attribute4);


    if ((DispositionSurvey) && (DispositionSurvey.selectedRecord)){
      attribute5 = (DispositionSurvey.selectedRecord.category)?DispositionSurvey.selectedRecord.category: null;
      attribute6 = (DispositionSurvey.selectedRecord.subcategory)?DispositionSurvey.selectedRecord.subcategory: null;
    } 
    console.log("Dispositon Survey attribute5 setVoiceAttribute: ", attribute5);
    console.log("Dispositon Survey attribute6 setVoiceAttribute: ", attribute6);

    let followed_by = _getTypeBy(outgoing);
    let destination = await _getDestination(outgoing);
    if ((!followed_by) || followed_by.includes("WARM")) {
      if (localStorage.getItem('followedBy')) { followed_by = localStorage.getItem('followedBy') };
      if (localStorage.getItem('toPlace')) { destination = localStorage.getItem('toPlace') };
    }
   
    console.log("followed_by setVoiceAttribute: ", followed_by);
    console.log("destination setVoiceAttribute: ", destination);

    let initiated_by = _getInitiatedby(task);
    let preceded_by = _getTypeBy(incoming);
    
   
    console.log("init_by setVoiceAttribute: ", initiated_by);
    console.log("prec_by setVoiceAttribute: ", preceded_by);  
    
    
    let source = _getSource(task, incoming);
    let queue = _getQueueName(task, outgoing);
    

    console.log("source setVoiceAttribute: ", source);
    console.log("queue setVoiceAttribute: ", queue);  
    console.log("newSegArr setVoiceAttribute: ", newSegArr); 
    let newAttributes = { 
        ...task.attributes,
        DispositionSurvey,
        conversations: {
          ...task.attributes.conversations,
          conversation_attribute_3: attribute3,
          conversation_attribute_4: attribute4,
          conversation_attribute_5: attribute5,
          conversation_attribute_6: attribute6,
          followed_by: followed_by,
          destination: destination,
          initiated_by: initiated_by,
          preceded_by: preceded_by,
          hang_up_by: _getHangUpBy(task),
          source: source,
          queue: queue
        }
    };
    if (newSegArr.length>0){
      newAttributes.segments = [...newSegArr];
    }
    console.log("newAttributes setVoiceAttribute:", newAttributes);

    await task
      .setAttributes({
        ...newAttributes
    });
    
    FlexActions.invokeAction('CompleteTask', {sid: reservationSid});
  }
}
  