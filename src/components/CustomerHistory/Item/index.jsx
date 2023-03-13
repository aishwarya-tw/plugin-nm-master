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

import { CONVERSATION_DATE_FORMAT } from '../../../utils/constants';
import styles from './styles';

const TypeIcons = {
  EMAIL: EmailIcon,
  SMS: SMSIcon,
  WEBCHAT: ChatIcon
};

class Item extends Component {
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

    var transferFlag1 = false;
    var transferFlag2 = false;
    var secondDisposition ="";
    var messagesLength = 1;

    if(conversation.TransferDetails){
      transferFlag1 = true;
    }

    if(conversation.Messages){
      if(conversation.Messages[conversation.Messages.length - 1].TransferDetails){
        transferFlag2 = true;
        for (let i = 0; i < conversation.Messages.length; i++) {
          if(conversation.AgentName !== conversation.Messages[i].InternalEntityName){
            secondDisposition = ", "+JSON.parse(conversation.Messages[i].Tags).DispositionType;
          }
        }
      }
    }

    const { MessageType: messageType } = conversation;
    const Icon = TypeIcons[messageType];

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
            className={clsx(classes.iconCircle, classes[messageType + 'Icon'], classes[messageType+conversation.Direction] )}
          >
            {/*
              TODO: convert this to use the same icons as DefaultTaskChannels
              possibly using `Flex.TaskChannels.getRegistered()`
            */}
            {Icon && <Icon className={classes.icon} />}
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
            {(transferFlag1 || transferFlag2) &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transferred</Typography>
              <Typography className={classes.bottomValue}>
                {"Yes"}
              </Typography>
            </Grid>
            }
            {!(transferFlag1 || transferFlag2) &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transferred</Typography>
              <Typography className={classes.bottomValue}>
                {"No"}
              </Typography>
            </Grid>
            }
            {(transferFlag2) &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Transfer Note</Typography>
              <Typography className={classes.bottomValue}>
                {JSON.parse(conversation.Messages[conversation.Messages.length - 1].TransferDetails).TransferNote}
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
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Item);
