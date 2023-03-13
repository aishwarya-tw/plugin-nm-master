import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import styles from './styles';
import * as Flex from '@twilio/flex-ui';
import moment from 'moment';
import BubbleAttachment from '../BubbleAttachment';
import { ChannelTypes } from '../../utils/constants';
import Resource from '../../utils/resource';
import { CircularProgress } from '@material-ui/core';

const EmailBodyResource = Resource('get-email-body');

class EmailMessageBubble extends Component {
  constructor(props) {
    super(props);

    this.manager = Flex.Manager.getInstance();

    this.state = {
      emailBody: undefined,
      error: false
    };
  }

  componentDidMount = () => {
    const { message } = this.props;
    this.loadEmailMessage(message);
  };

  loadEmailMessage(message) {
    const self = this;

    if (message.source.body) {
      let emailIdentifier;
      try {
        if (message.isFromMe === false) {
          emailIdentifier = JSON.parse(message.source.body);
          if (
            !emailIdentifier ||
            !emailIdentifier.bucketName ||
            !emailIdentifier.objectKey
          ) {
            throw new Error('Not valid JSON');
          }
        } else {
          self.setState({ emailBody: message.source.body });
          return;
        }
      } catch (error) {
        console.warn(
          "Could not parse message body as a JSON object. Assuming it's a HTML message"
        );
        self.setState({ emailBody: message.source.body });
        return;
      }

      try {
        EmailBodyResource.read({
          bucketName: emailIdentifier.bucketName,
          objectKey: emailIdentifier.objectKey
        })
          .then(result => self.setState({ emailBody: result.email.body }))
          .catch(error => {
            self.setState({
              error: true
            });
          });
      } catch (error) {
        console.error(`Error retrieving e-mail body: ${error}`);
        self.setState({
          error: true
        });
      }
    } else {
      console.error('Missing message.source.body.');
      this.setState({
        error: true
      });
    }
  }

  render() {
    const { classes, message } = this.props;
    const { source } = message;
    const { attributes } = source;
    const { attachments, source: direction } = attributes;
    const { emailBody, error } = this.state;

    return (
      <div className={classes.container}>
        <div className={classes.headerWrapper}>
          <span className={classes.authorName}>
            {message.isFromMe === false
              ? message.source.author
              : this.manager.workerClient.attributes.public_identity
              ? this.manager.workerClient.attributes.public_identity
              : this.manager.workerClient.attributes.full_name}
          </span>
          <span className={classes.timestamp}>
            {moment(message.source.timestamp).format('HH:mm A')}
          </span>
        </div>
        {error && (
          <div className={classes.body}>
            <span>An error has occured while retrieving message body.</span>
          </div>
        )}
        {!error && !emailBody && (
          <div className={classes.body}>
            <CircularProgress size={28} color="inherit" />
          </div>
        )}
        {!error && emailBody && (
          <div
            className={classes.body}
            dangerouslySetInnerHTML={{
              __html: emailBody
            }}
          ></div>
        )}
        {attachments && attachments.length > 0 && (
          <BubbleAttachment
            message={message}
            direction={direction}
            messageType={ChannelTypes.email}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(EmailMessageBubble);
