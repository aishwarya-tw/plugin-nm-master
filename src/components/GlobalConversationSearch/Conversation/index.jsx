import React, { Component } from 'react';
import clsx from 'clsx';
import moment from 'moment';

import { Typography, withStyles } from '@material-ui/core';

import styles from './styles';
import BubbleAttachment from '../../BubbleAttachment';

class Conversation extends Component {
  messagesEndRef = React.createRef();

  componentDidMount = () => {
    this.scrollToBottom();
  };

  renderMessages = () => {
    const { classes, customerName, conversation } = this.props;
    const { Messages: messages ,AgentName: agentName = 'Agent'} = conversation; 

    const dateGroupedMessages = messages.reduce((dates, message) => {
      const { DateCreated } = message;
      const date = moment(DateCreated).format('MM/DD/YYYY');

      if (!dates[date]) {
        dates[date] = [];
      }

      dates[date].push(message);
      return dates;
    }, {});

    const dateMessageItem = displayDate => (
      <div className={classes.message}>
        <div className={classes.inlineMessage}>
          <div className={classes.inlineSep}>
            <hr />
            <div>{displayDate}</div>
            <hr />
          </div>
        </div>
      </div>
    );

    const messageItem = (messageData, sameDirectionAsLast) => {
      const {
        Direction: direction,
        MessageType: messageType,
        DateCreated: dateCreated,
        Preview: body,
        Attachments: attachments,
        Subject: subject
      } = messageData;
      const isAgent = direction === 'Outbound';

      let attachmentMesasge;
      if (attachments && attachments.length > 0) {
        attachmentMesasge = { attachments };
        // let attachmentList = []

        //   attachments.map(a => {
        //     attachmentList.push({
        //       name: '',
        //       s3Key: a
        //     })
        //     return null;
        //   })

        // attachmentMesasge = {attachments: attachmentList}
      }


      return (
        <div
          className={clsx(
            classes.messageListItem,
            sameDirectionAsLast && classes.messageListItemSameDirection
          )}
        >
          {subject && !sameDirectionAsLast && (
            <Typography className={this.props.classes.subject}>
              {subject}
            </Typography>
          )}
          <div className={classes.messageListItemContent}>
            <div
              className={clsx(
                classes.messageBubbleWrapper,
                isAgent && classes.messageBubbleWrapperAgent
              )}
            >
              <div
                className={clsx(
                  classes.messageBubble,
                  isAgent && classes[`messageBubble${messageType}`]
                )}
              >
                {typeof body === 'undefined' &&
                <div className={classes.messageBubbleContent}>
                  <div className={classes.messageBubbleHeader}>
                    <div className={classes.messageBubbleAuthor}>
                      {isAgent ? (messageData.InternalEntityName ? messageData.InternalEntityName : (messageType === "EMAIL" ? agentName : JSON.parse(messageData.Tags).AgentName)) : customerName}
                    </div>
                    <div className={classes.messageBubbleTime}>
                      {moment(dateCreated).format('hh:mm A')}
                    </div>
                  </div>

                  <div className={classes.messageBubbleBody}>{body}</div>
                  <div className={classes.messageBubbleAttachment}>
                    {attachments && attachments.length > 0 && (
                     <BubbleAttachment
                      direction={direction}
                      messageType={messageType}
                      message={attachmentMesasge}
                      isHistory={true}
                     />
                  )}
                  </div>
                </div>
                } 
                {body && body.includes("We appreciate your patience, the estimated wait time for the next associate is") &&
                <div className={classes.messageBubbleContent}>
                <div className={classes.messageBubbleHeader}>
                  <div className={classes.messageBubbleAuthor}>
                    {isAgent ? (messageData.InternalEntityName ? messageData.InternalEntityName : agentName) : "Customer Service"}
                  </div>
                  <div className={classes.messageBubbleTime}>
                    {moment(dateCreated).format('hh:mm A')}
                  </div>
                </div>
                <div className={classes.messageBubbleBody}>{body}</div>
                </div>
                }
                {body && !body.includes("We appreciate your patience, the estimated wait time for the next associate is") &&
                <div className={classes.messageBubbleContent}>
                  <div className={classes.messageBubbleHeader}>
                    <div className={classes.messageBubbleAuthor}>
                      {isAgent ? (messageData.InternalEntityName ? messageData.InternalEntityName : (messageType === "EMAIL" ? agentName : JSON.parse(messageData.Tags).AgentName)) : customerName}
                    </div>
                    <div className={classes.messageBubbleTime}>
                      {moment(dateCreated).format('hh:mm A')}
                    </div>
                  </div>

                  <div className={classes.messageBubbleBody}>{body}</div>
                  <div className={classes.messageBubbleAttachment}>
                    {attachments && attachments.length > 0 && (
                     <BubbleAttachment
                      direction={direction}
                      messageType={messageType}
                      message={attachmentMesasge}
                      isHistory={true}
                     />
                  )}
                  </div>
                </div>
                }



              </div>
            </div>
          </div>
        </div>
      );
    };

    return Object.keys(dateGroupedMessages).map(date => {
      const dateMessages = dateGroupedMessages[date];

      let messageEls = [];
      for (let idx = 0; idx < dateMessages.length; idx++) {
        const message = dateMessages[idx];
        const { Direction: direction } = message;
        const sameDirectionAsLast =
          idx > 0 ? direction === dateMessages[idx - 1].Direction : false;

        messageEls.push(messageItem(message, sameDirectionAsLast));
      }

      return (
        <>
          {dateMessageItem(date)}
          {messageEls}
        </>
      );
    });
  };

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.list}>
          {this.renderMessages()}
          <div ref={this.messagesEndRef} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Conversation);