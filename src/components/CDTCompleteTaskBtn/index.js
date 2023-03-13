import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';
import {
  REDUX_NAMESPACE,
  CDT_INCOMPLETE_NOTIFICATION
} from '../../utils/constants';

import { MuiThemeProvider, withStyles } from '@material-ui/core';

import styles from './styles';
import defaultTheme from '../../themes/defaultTheme';

class CDTCompleteTaskBtn extends Component {
  // componentDidMount() {
  //   this.checkForNotification();
  // }
  // componentDidUpdate() {
  //   this.checkForNotification();
  // }

  constructor(props) {
    super(props);
    this.state = {
      enableButton: true
    };
  }

  componentDidMount = () => {
    let self = this;
    setTimeout(function () {
      self.setState({ enableButton: true });
    }, 0);
  };

  missingCDTdata = () => {
    const { tools, task } = this.props;
    const { taskSid } = task;

    let data = [];
    if (!tools[taskSid] || !tools[taskSid].DispositionSurvey) {
      return false;
    }

    if (
      !tools[taskSid].DispositionSurvey.customer ||
      !tools[taskSid].DispositionSurvey.customer.name
    ) {
      data.push('Name');
    }
    if (
      !tools[taskSid].DispositionSurvey.customer ||
      !tools[taskSid].DispositionSurvey.customer.email
    ) {
      data.push('Email');
    }
    if (
      !tools[taskSid].DispositionSurvey.tags ||
      !tools[taskSid].DispositionSurvey.tags.length ||
      !tools[taskSid].DispositionSurvey.tags[0].category
    ) {
      data.push('Reason for contact');
    }

    return data;
  };

  checkForNotification = () => {
    const missingCDTdata = this.missingCDTdata();
    if (missingCDTdata && missingCDTdata.length) {
      let missingInfo = '';
      for (let i = 0; i < missingCDTdata.length; i++) {
        if (i === missingCDTdata.length - 1) {
          missingInfo += missingCDTdata[i];
        } else {
          missingInfo = missingInfo + missingCDTdata[i] + ' & ';
        }
      }
      Flex.Notifications.dismissNotificationById(CDT_INCOMPLETE_NOTIFICATION);
      Flex.Notifications.showNotification(CDT_INCOMPLETE_NOTIFICATION, {
        missingInfo
      });
      return false;
    } else {
      Flex.Notifications.dismissNotificationById(CDT_INCOMPLETE_NOTIFICATION);
      return true;
    }
  };
  getInitiatedby = (task) => {
    if (task.incomingTransferObject)
      return task.incomingTransferObject.workerSid;
    if ((task.attributes.direction) && (task.attributes.direction === 'inbound')) {
      return "Customer";
    }
    if ((task.attributes.direction) && (task.attributes.direction === 'outbound')) {
      return task.workerSid;
    }
    return null;
  };

  getHangUpBy = (task) =>{
    let hang_up_by="";
    if ((task.outgoingTransferObject) && (task.outgoingTransferObject.mode === "COLD")){
      hang_up_by="Agent";
    } else {
      const hangUp = localStorage.getItem('HangUp');
      hang_up_by = (hangUp && hangUp=='true')?'Agent':'Customer';
      if ((task.transfers) && (task.transfers.outgoing) && (task.transfers.outgoing.mode === "COLD")){
        hang_up_by="Agent";
      }
    }
    return hang_up_by;
  }

  getQueueName = (task) =>{
    let currentQueueName = localStorage.getItem('CurrentQueueName') || task.queueName;
    console.log('current Queue Name',currentQueueName);
    if ((task.incomingTransferObject) || (task.outgoingTransferObject)){
      //find original queueName by workersid
      const { sourceQueues = [] } = task.attributes;
      let obj = sourceQueues.find(q => q.workersid === task.workerSid);
      currentQueueName = obj ? obj.queueName : currentQueueName; 
    }
    return currentQueueName;
  }

  getSource = (task) => {
    if (task.incomingTransferObject){
      //find original queueName by workersid
      const sourceAgentSid = task.incomingTransferObject.workerSid;
      const sourceType = task.incomingTransferObject.type;
      
      if (sourceType === 'QUEUE'){
        const { sourceQueues = [] } = task.attributes;
        let obj = sourceQueues.find(q => q.workersid === sourceAgentSid);
        return (obj ? obj.queueName : null);
      }
      return sourceAgentSid; 
    }
    return null;
  }

  // componentWillReceiveProps(nextProps) {
  //   this.dataIncomplete(nextProps);
  // }

  handleCompleteTask = () => {
    const { tools, task, call } = this.props;
    const { taskSid, sid } = task;
    //outbound channeltype is in a different place than inbound call
    let isVoice = false;
    if (((task.channelType) && (task.channelType==='voice')) ||
        ((task.attributes.channelType) && (task.attributes.channelType==='voice'))){
          isVoice = true;
        }

    //attribute3 = conferenceSid/channelSid
    //attribute4 = agentCallSid
    let attribute3 = (task && task.attributes && 
            task.attributes.conversations && 
            task.attributes.conversations.conversation_attribute_3)? 
            task.attributes.conversations.conversation_attribute_3:"";
    console.log("conversation_attribute_3", attribute3);        
    let attribute4 = (task && task.attributes && 
            task.attributes.conversations && 
            task.attributes.conversations.conversation_attribute_4)? 
            task.attributes.conversations.conversation_attribute_4:"";    

    if (isVoice) {  
      const reservationSid = task.sid;
      console.log("Dispositon Survey reservation sid ", task.sid);
      const conference = task && (task.conference || {});
      attribute3 = (conference.conferenceSid)? conference.conferenceSid:"";
      let participants = (conference)? conference.participants:[];
      if (participants){
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].reservationSid === reservationSid){
            attribute4 = participants[i].callSid;
          }
        }
      }
    }

    const { DispositionSurvey } = tools[taskSid];
    
    let attribute5 = 'None';
    let attribute6 = 'None';
    if ((DispositionSurvey) && (DispositionSurvey.selectedRecord)){
      attribute5 = (DispositionSurvey.selectedRecord.category)?DispositionSurvey.selectedRecord.category:'None';
      attribute6 = (DispositionSurvey.selectedRecord.subcategory)?DispositionSurvey.selectedRecord.subcategory:'None';
    }
    console.log("Dispositon Survey attribute3 ", attribute3);
    console.log("Dispositon Survey attribute4 ", attribute4);
    console.log("Dispositon Survey attribute5 ", attribute5);
    console.log("Dispositon Survey attribute6 ", attribute6);
    console.log("TASK",task);

    const getTypeBy = (transferDescriptor = {}) => {
      if (transferDescriptor?.mode) {
        return transferDescriptor.mode + ":" + transferDescriptor.type + ":" + transferDescriptor.status;
      } else {
        return null;
      }
    }

    const getStatusType = (transferDescriptor = {}) => {
      switch (transferDescriptor?.type) {
        case "QUEUE": return transferDescriptor.queue.name;
        case "WORKER": return transferDescriptor.to;
        default: return null;
      }
    }

    if (this.checkForNotification()) {
      if (isVoice){
        let followedBy = getTypeBy(task.outgoingTransferObject);
        let toPlace = getStatusType(task.outgoingTransferObject);
        if ((!followedBy) || followedBy.includes("WARM")){
          if (localStorage.getItem('followedBy')){ followedBy = localStorage.getItem('followedBy')} ;
          if (localStorage.getItem('toPlace')){ toPlace = localStorage.getItem('toPlace') };
        } 
        console.log("followed_by: ", followedBy);
        console.log("destination: ", toPlace);

        task
          .setAttributes({
            ...task.attributes,
            DispositionSurvey,
            conversations: {
              ...task.attributes.conversations,
              conversation_attribute_3: attribute3,
              conversation_attribute_4: attribute4,
              conversation_attribute_5: attribute5,
              conversation_attribute_6: attribute6,
              followed_by: followedBy,
              destination: toPlace,
              initiated_by: this.getInitiatedby(task) || null,
              preceded_by: getTypeBy(task.incomingTransferObject),
              hang_up_by: this.getHangUpBy(task) || null,
              source: this.getSource(task) || null,
              queue: this.getQueueName(task) || null
            }
          })
          .then(() => {
            console.log(
              'voice Dispositon Survey added to task attributes',
              task
            );
            Flex.Actions.invokeAction('CompleteTask', { task });
            if (call) {
              Flex.Actions.invokeAction('HangupCall', { sid: sid });
            }
          });
      }else {
        //for agent 1 that transferred chat, delete channelSid so that chat widget wouldn't close upon 
        //task complete
        console.log("before delete channelsid!!!",task.taskChannelUniqueName + " "+ task.workerSid);
        ;
        let transferStatus = task.attributes?.transfer?.status || "none";
        let fromWorkerSID =  task.attributes?.transfer?.fromWorkerSID || "none";
        console.log("before delete channelsid!!!",transferStatus);
        console.log("before delete channelsid!!!",fromWorkerSID);
        if ((task.taskChannelUniqueName === 'chat') &&
            (transferStatus === 'success') &&
            (task.workerSid === fromWorkerSID)){
            console.log("delete channelsid!!!");
            delete task.attributes.channelSid;
        }
        task
         .setAttributes({
          ...task.attributes,
          DispositionSurvey,
          conversations: {
              ...task.attributes.conversations,
              conversation_attribute_5: attribute5,
              conversation_attribute_6: attribute6
          }
        })
        .then(() => {
          console.log(
            'non-voice Dispositon Survey added to task attributes',
            task
          );
          Flex.Actions.invokeAction('CompleteTask', { task });
        });

      }
    }
  };

  // dataIncomplete = (props = this.props) => {
  //   const {tools, task} = props;
  //   const {taskSid} = task;

  //   return tools[taskSid] && tools[taskSid].DispositionSurvey
  //     && tools[taskSid].DispositionSurvey.customer && tools[taskSid].DispositionSurvey.employee
  //     && tools[taskSid].DispositionSurvey.customer.name && tools[taskSid].DispositionSurvey.customer.email
  //     && tools[taskSid].DispositionSurvey.employee.email && tools[taskSid].DispositionSurvey.channel
  //     &&  tools[taskSid].DispositionSurvey.brand && tools[taskSid].DispositionSurvey.ext_interaction_id
  //     && tools[taskSid].DispositionSurvey.tags && tools[taskSid].DispositionSurvey.tags.length
  //     && tools[taskSid].DispositionSurvey.tags[0].category && (tools[taskSid].DispositionSurvey.do_not_send !== null) ? false : true
  // }

  render() {
    const { classes } = this.props;
    const { enableButton } = this.state;

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <div>
          {enableButton && (
            <Flex.Button
              className={classes.btn}
              // disabled={this.dataIncomplete()}
              onClick={this.handleCompleteTask}
            >
              <span>COMPLETE</span>
            </Flex.Button>
          )}
          {!enableButton && (
            <Flex.Button
              className={classes.btn}
              // disabled={this.dataIncomplete()}
              //disabled="disabled"
              onClick={this.handleCompleteTask}
            >
              <span>COMPLETE</span>
            </Flex.Button>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  tools: state[REDUX_NAMESPACE].tools
});

const mapDispatchToProps = dispatch => ({
  setToolState: bindActionCreators(Actions.setToolState, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CDTCompleteTaskBtn));
