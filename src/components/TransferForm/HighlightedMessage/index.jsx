import React from 'react';
import clsx from 'clsx';
import { Icon } from '@twilio/flex-ui';
import { Icon as MuiIcon, withStyles, Grid } from '@material-ui/core';
import styles from './styles';
import AttachmentItem from '../../AttachmentItem/';

const formatTime = timestamp => {
  const localTimestamp = new Date(timestamp);
  const hours24 = localTimestamp.getHours();
  const minutes = localTimestamp.getMinutes();
  const hours12 = ((hours24 + 11) % 12) + 1;
  const displayHours = hours12 < 10 ? `0${hours12}` : hours12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${hours24 < 12 ? 'AM' : 'PM'}`;
};

class HighlightedMessage extends React.Component {
  handleCheckClick = () => {
    const { message, taskSid, onClick } = this.props;
    onClick(taskSid, message);
  };

  handleMessageClick = () => {
    const { message } = this.props;
    const { sid: channelSid } = message.source.channel;

    document
      .getElementById(`${channelSid}-${message.index}`)
      .scrollIntoView({ behavior: 'smooth' });
  };

  checkCircleContent = () => {
    const { isSelectable, classes } = this.props;

    if (isSelectable) {
      return (
        <div onClick={this.handleCheckClick} className={classes.clickable}>
          <MuiIcon className={classes.checkcircle}>check_circle</MuiIcon>
        </div>
      );
    } else {
      return (
        <div>
          <MuiIcon className={classes.checkcircle}>check_circle</MuiIcon>
        </div>
      );
    }
  };
  render() {
    const { message, previousAgent, classes } = this.props;
    const time = formatTime(message.source.timestamp);
    
    let authorName = message.authorName;
    
    // sometimes the author name is randomly undefined
    if (!authorName) {
      const author = message.source?.state?.author;
      const customerName = message.source?.channel?.attributes?.from;
      //state.author shows an id number except for when it's Customer Service
      if (author === 'Customer Service') {
        authorName = author;
        // as long as the author name is always defined for the agent, this will work
      } else {
        authorName = customerName;
      }
    }
    // if it's STILL undefined, just call it Customer Service and wash your hands of the situation
    if (!authorName) {
      authorName = 'Customer Service';
    }
    console.log("HERE" + authorName)
    const isFromAgent = message.isFromMe || previousAgent === authorName;
    let attachments = message.source.attributes.attachments;
    const messageStyle = clsx({
      [classes.messageBubble]: true,
      [classes.clickable]: true,
      [classes.agentMessageBubble]: isFromAgent
    });
    return (
      <div className={classes.content}>
        {this.checkCircleContent()}
        <div className={classes.avatar}>
          <Icon icon="DefaultAvatar" />
        </div>
        <div className={messageStyle} onClick={this.handleMessageClick}>
          <div className={classes.header}>
            <div className={classes.username}>{authorName}</div>
            <div className={classes.timestamp}>{time}</div>
          </div>
          <div className={classes.body}>
            <span>{message.source.body}</span>
          </div>
          {attachments && (
            <Grid
              container
              direction="column"
              item
              xs={12}
              className={classes.attachmentContainer}
            >
              <AttachmentItem
                attachment={attachments[0]}
                key={attachments.name}
              />
            </Grid>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HighlightedMessage);
