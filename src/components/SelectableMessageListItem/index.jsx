import React from 'react';
import clsx from 'clsx';
import MessageCheckbox from './MessageCheckbox';
import { MessageBubble, Icon, withTaskContext } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import styles from './styles';

class SelectableMessageListItem extends React.Component {
  render() {
    const { message, showReadStatus, channelSid, classes } = this.props;
    const { isFromMe } = message;

    const bubbleContainerStyle = clsx({
      [classes.bubbleContainer]: true,
      [classes.myMessage]: isFromMe,
    });

    return (
      <>
        <div
          className={`Twilio-MessageListItem-ContentContainer ${classes.content}`}
          id={`${channelSid}-${message.index}`}
        >
          <MessageCheckbox
            message={message}
            taskSid={this.props.task.taskSid}
          />
          {!isFromMe && (
            <div className={`Twilio-MessageListItem-AvatarContainer ${classes.avatarContainer}`}>
              <div className={`Twilio-MessageListItem-Avatar ${classes.avatar}`}>
                <Icon icon="DefaultAvatar" />
              </div>
            </div>
          )}
          <div className={`Twilio-MessageListItem-BubbleContainer ${bubbleContainerStyle}`}>
            <MessageBubble {...this.props} />
          </div>
        </div>
        <div className={`Twilio-MessageListItem-end ${classes.end}`}></div>
        {showReadStatus && (
          <div className={`Twilio-MessageListItem-ReadStatus ${classes.read}`}>
            <span>Read</span>
            <Icon icon="Read" />
          </div>
        )}
      </>
    );
  }
}

export default withTaskContext(withStyles(styles)(SelectableMessageListItem));