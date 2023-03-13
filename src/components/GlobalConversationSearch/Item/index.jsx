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
    //console.log('conversation : ', conversation)
    const dateTime = moment(conversation.DateCreated).format(
      CONVERSATION_DATE_FORMAT
    );

    const { MessageType: messageType } = conversation;
    const Icon = TypeIcons[messageType];
    // if(!Icon) {
    //   console.log("MISSING ICON : ", messageType)
    // }
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
            { Icon && <Icon className={classes.icon} /> }
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
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Date Created</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.DateCreated}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Channel</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.MessageType}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Body</Typography>
              <Typography className={classes.bottomValue}>
                <div className={classes.divBody}> {conversation.Body}</div>
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Direction</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Direction}
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
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Brand</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.Brand}
              </Typography>
            </Grid>

            { conversation.ProactiveChat &&
            <Grid item xs={6}>
              <Typography className={classes.bottomLabel}>Proactive Chat</Typography>
              <Typography className={classes.bottomValue}>
                {conversation.ProactiveChat.replace("EventType","")}
              </Typography>
            </Grid>
            }
            { conversation.TransferDetails &&
              <Grid item xs={6}>
                <Typography className={classes.bottomLabel}>Transferred</Typography>
                <Typography className={classes.bottomValue}>
                {"Yes"}
                </Typography>
              </Grid>
            }
            { !conversation.TransferDetails &&
              <Grid item xs={6}>
                <Typography className={classes.bottomLabel}>Transferred</Typography>
                <Typography className={classes.bottomValue}>
                {"No"}
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
