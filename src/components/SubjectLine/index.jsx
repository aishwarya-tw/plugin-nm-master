import React, { Component } from 'react';
import moment from 'moment';

import * as Flex from '@twilio/flex-ui';
import { withTaskContext } from '@twilio/flex-ui';

import { Typography, withStyles } from '@material-ui/core';
import styles from './styles';

class SubjectLine extends Component {
  renderSubject = () => {
    // get a channel from state based on current task's channel sid
    const state = Flex.Manager.getInstance().store.getState().flex;
    const channelSid = this.props.task.attributes.channelSid;
    const messages = state.chat.channels[channelSid].messages;

    // get the index of the current message in the message list of the channel
    let thisMessage = this.props.message;
    const messageSubject = thisMessage.source.attributes.subject;
    const thisMessageIdx = messages.findIndex(
      message => message.source.sid === thisMessage.source.sid
    );

    // start by saying the subject can be rendered
    let shouldRenderSubject = true;
    if (thisMessageIdx > 0) {
      // get the previous message's subject and compare it with the current one
      let lastMessage = messages[thisMessageIdx - 1];

      // make sure the last email isn't from the agent
      if (lastMessage.isFromMe === false) {
        const lastMessageSubject = lastMessage.source.state.attributes.subject;
        const subjectsSame = messageSubject === lastMessageSubject;

        // subject check is good, but if the messages fall under different days
        // the layout will look wonky with the date divider in between them
        const messageDate = moment(thisMessage.source.timestamp);
        const lastMessageDate = moment(lastMessage.source.state.timestamp);
        const datesSame = messageDate.isSame(lastMessageDate, 'day');

        if (datesSame && subjectsSame) {
          // dates are the same, and subjects are the same
          // so don't render subject for this message
          shouldRenderSubject = false;
        } else {
          // force fix the message grouping attributes to
          // re-render the avatar since there's now going to be a
          // subject above this message making it feel out of place
          thisMessage.groupWithPrevious = false;
          lastMessage.groupWithNext = false;
        }
      }
    }

    const subject = messageSubject ? messageSubject : '(No Subject)';
    return (
      shouldRenderSubject && (
        <Typography className={this.props.classes.subject}>
          {subject}
        </Typography>
      )
    );
  };

  render() {
    return <React.Fragment>{this.renderSubject()}</React.Fragment>;
  }
}

export default withStyles(styles)(withTaskContext(SubjectLine));
