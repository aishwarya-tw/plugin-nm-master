import React, { Component } from 'react';
import { Manager, Notifications, Actions, ChatOrchestrator } from '@twilio/flex-ui';
import { GENERAL_ERROR_NOTIFICATION } from '../../utils/constants';
import { Grid, withStyles, Paper, Typography, Tab, Tabs, Button } from '@material-ui/core';
import {InputContainer, StyledInput } from '../AvailableQueuesTab/ContainerComponents';
import styles from './styles';
import Agentlist from './Lists/Agentlist';
import Queuelist from './Lists/Queuelist';
import Resource from '../../utils/resource';

const TransferChatResource = Resource('transfer-chat');
const manager = Manager.getInstance();

class TransferAgentlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedList: "Queues",
      disableTransfer: false
    };
  }

  handleSetList = (event, value) => {
    this.setState({ selectedList: value });
  }

  handleDisableTransferButton = (boolean) =>{
    this.setState({
      disableTransfer: boolean
    })
  }
  transferChat = (targetSid, targetFriendlyName, product) => {
    const {
      note,
      contactReason,
      customerMood,
      messages,
      task,
    } = this.props;

    const transfer = {
      from: manager.workerClient.attributes.full_name,
      prevAgentIdentity: manager.workerClient.attributes.public_identity,
      destination: targetFriendlyName,
      note: note,
      reasonForContact: contactReason,
      customerInteraction: customerMood,
      fromQueue: task.queueName,
      fromWorkerSID: manager.workerClient.sid,
      destWorkerSid: targetSid,
      highlightMessages: messages,
      product: product
    }

    TransferChatResource.create({
      targetSid,
      transfer,
      taskSid: task.taskSid,
      workerName: manager.workerClient.attributes.full_name,
    })
      .then(response => {  
        ChatOrchestrator.setOrchestrations('wrapup', []); 
        console.log("about to do action!!!", task.attributes);
        Actions.invokeAction('WrapupTask', {
            task
        })
      })
      .catch(error => {
        console.log("Chat Transfer failed with error:", error);
        Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
          errorMessage: `Chat Transfer Failed`
        });
      });
  }
  
  renderList = () => {
    switch (this.state.selectedList) {
      case "Agents":
        return (<Agentlist 
          agentName= {manager.workerClient.attributes.full_name} 
          transferChat={this.transferChat} 
          disableTransfer= {this.state.disableTransfer}
          handleDisableTransferButton = {this.handleDisableTransferButton}
          />)
          
      case "Queues":
      default:
        return (<Queuelist transferChat={this.transferChat} 
        disableTransfer= {this.state.disableTransfer}
          handleDisableTransferButton = {this.handleDisableTransferButton}
        />);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.TransferBox}>
         <div className={classes.upperTransferBox}>
          <h3 className={classes.transferTitle}>Transfer</h3>
          <Tabs value={this.state.selectedList} onChange={this.handleSetList} variant="fullWidth">
            <Tab value="Queues" label="Queues" />
            <Tab value="Agents" label="Agents" />
          </Tabs>
        {this.renderList()}
      </div>
      </div>
    );
  }
}

export default withStyles(styles)(TransferAgentlist);