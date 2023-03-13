import React, { Component } from 'react';
import moment from 'moment';
import clsx from 'clsx';

import { Grid, Paper, Typography, withStyles } from '@material-ui/core';

import {
  Email as EmailIcon,
  Textsms as SMSIcon,
  Chat as ChatIcon
} from '@material-ui/icons';

import NMIconButton from '../../NMIconButton';
import ViewIcon from '../../../assets/ViewIcon';
import CloseIcon from '../../../assets/CloseIcon';

import { ExportToCSV } from '../ExportToCSV'; 
import { CONVERSATION_DATE_FORMAT } from '../../../utils/constants';
import styles from './styles';

const TypeIcons = {
  EMAIL: EmailIcon,
  SMS: SMSIcon,
  WEBCHAT: ChatIcon
};

class ConversationItem extends Component {
  state = {};
  render() {
    const {
      classes,
      conversation,
      onView,
      isDetails = false,
      onClose
    } = this.props;
    const dateTime = moment(conversation.DateCreated).format(
      CONVERSATION_DATE_FORMAT
    );

    const { MessageType: messageType } = conversation;
    const Icon = TypeIcons[messageType];


    var secondAgent = "";
    var secondDisposition = "";
    
    var messagesLength = conversation.Messages.length;

      for (let i = 0; i < conversation.Messages.length; i++) {
        if((conversation.AgentName !== conversation.Messages[i].InternalEntityName)&&(conversation.Messages[messagesLength - 1].TransferDetails)){
          secondAgent = ", "+conversation.Messages[i].InternalEntityName;
          secondDisposition = ", "+JSON.parse(conversation.Messages[i].Tags).DispositionType;
        }
      }

    return (
      <Paper
        elevation={0}
        className={clsx(
          classes.container,
          isDetails && classes.detailsContainer
        )}
      >
        <div className={classes.sideWrapper}>
          <Grid
            container
            justify="center"
            alignItems="center"
            className={clsx(classes.iconCircle, classes[messageType + 'Icon'])}
          >
            {/*
              TODO: convert this to use the same icons as DefaultTaskChannels
              possibly using `Flex.TaskChannels.getRegistered()`
            */}
            {Icon && <Icon className={classes.icon} /> }
          </Grid>
        </div>

        <div className={classes.textWrapper}>
          <Grid container direction="column" className={classes.topText}>
            <Typography className={classes.dateTime}>{dateTime}</Typography>
            <Typography className={classes.orderNo}>
              {conversation.OrderNumber}
            </Typography>
            <Typography className={classes.preview}>
              {conversation.Preview}
            </Typography>
          </Grid>

          <Grid container>
          <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Agent Name</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.AgentName}
                {secondAgent}
                 
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>ConversationId</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.ConversationId}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Date Created</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.DateCreated}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Customer Address</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Messages[0].ExternalAddress}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Internal Address</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Messages[0].InternalAddress}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Channel</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.MessageType}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Direction</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Messages[0].Direction}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>
                Disposition
              </Typography>
              <Typography className={classes.bottomValue}>
                {conversation.DispositionType ? (
                  conversation.DispositionType
                ) : (
                  <>&mdash;</>
                )}
                {secondDisposition}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Brand</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Brand}
              </Typography>
            </Grid>

            {conversation.Messages[messagesLength - 1].TransferDetails &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transferred</Typography>
              <Typography className={classes.bottomValue}>
                {"Yes"}
              </Typography>
            </Grid>
            }

            {!conversation.Messages[messagesLength - 1].TransferDetails &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transferred</Typography>
              <Typography className={classes.bottomValue}>
                {"No"}
              </Typography>
            </Grid>
            }

            {conversation.Messages[messagesLength - 1].TransferDetails &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transfer Note</Typography>
              <Typography className={classes.bottomValue}>
                {JSON.parse(conversation.Messages[messagesLength - 1].TransferDetails).TransferNote}
              </Typography>
            </Grid>
            }
            { conversation.ProactiveChat &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Proactive Chat</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.ProactiveChat.replace("EventType","")}
              </Typography>
            </Grid>
            }
          </Grid>
        </div>

        <div className={classes.sideWrapper}>
          {!isDetails && (
            <NMIconButton
              icon={<ViewIcon variant="blue" />}
              variant="transparent"
              onClick={() => onView(conversation)}
              className={classes.actionBtn}
            />
          )}

          {isDetails && (
            <NMIconButton
              icon={<CloseIcon variant="blue" />}
              variant="transparent"
              onClick={() => onClose()}
              className={classes.actionBtn}
            />
          )}
          <ExportToCSV csvData={this.props} fileName={'conversation'} />
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ConversationItem);
