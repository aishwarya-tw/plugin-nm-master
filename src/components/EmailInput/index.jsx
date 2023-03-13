import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/EmailReducer';
import {
  REDUX_NAMESPACE,
  POSTPONE_TASK_LIMIT_NOTIFICATION,
  POSTPONE_WORKER_LIMIT_NOTIFICATION,
  BACKEND_ERROR_NOTIFICATION,
  BACKEND_WARNING_NOTIFICATION
} from '../../utils/constants';
import { TaskStatuses } from '../../utils/constants';

import Resource from '../../utils/resource';

import {
  MuiThemeProvider,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core';

import styles from './styles';
import defaultTheme from '../../themes/defaultTheme';

import AttachmentItem from '../AttachmentItem/';
import AttachmentPicker from '../AttachmentPicker';
import PostponedScrim from '../PostponedScrim';
import SlashInput from '../SlashInput';
import NMInput from '../NMInput';
import NMButton from '../NMButton';
import EmojiPicker from '../EmojiPicker';
import ErrorIcon from '../../assets/ErrorIcon';

const manager = Flex.Manager.getInstance();
const AttachmentResource = Resource('save-attachment');

class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false, error: false, errorMessage: '' };
    this.inputRef = props.chatInputRef;
    this.processPaste = this.processPaste.bind(this);
  }

  processPaste(pasteEvent) {
    // We want to ignore paste events that do not have a file with them
    if(!pasteEvent.clipboardData || !pasteEvent.clipboardData.files[0]) {
      return;
    }

    const fileBlob = pasteEvent.clipboardData.items[0].getAsFile();
    this.handleAttachmentSelected(fileBlob);
  }

  // Attach our global listener for the paste event when the component mounts
  componentDidMount(){
    window.addEventListener('paste', this.processPaste);
  }

  // Clean up our listener when the component unmounts
  componentWillUnmount(){
    window.removeEventListener('paste', this.processPaste);
  }

  handleEmojiSelected = emoji => {
    const { task, email = {}, setEmailBody } = this.props;
    const { body = '' } = email;
    const selectionStart = this.inputRef.current.selectionStart;
    const selectionEnd = this.inputRef.current.selectionEnd;
    const startSlice = body.substring(0, selectionStart);
    const endSlice = body.substring(selectionEnd);
    const newBody = `${startSlice}${emoji}${endSlice}`;
    setEmailBody(task.taskSid, newBody);
    // Emoji characters are 2 characters long, so don't subtract 1 here like you'd expect
    const newSelectionStart = `${startSlice}${emoji}`.length;
    // Small hack to focus input after render and restore the cursor position
    setTimeout(() => {
      this.inputRef.current.focus();
      this.inputRef.current.setSelectionRange(
        newSelectionStart,
        newSelectionStart
      );
    }, 0);
  };

  setSubjectAndInReplyTo = () => {
    const {
      task,
      email,
      chatChannel,
      setEmailSubject,
      setEmailInReplyTo
    } = this.props;

    if (!(email && email.subject) && chatChannel.messages.length > 0) {
      const prevMessage = chatChannel.messages[chatChannel.messages.length - 1];
      const { subject: oldSubject, messageId } = prevMessage.source.attributes;

      let newSubject;
      if (oldSubject && oldSubject.includes('[EXTERNAL EMAIL]')) {
        // [EXTERNAL EMAIL] gets appended by neimans email rules
        newSubject = oldSubject.replace('[EXTERNAL EMAIL]', '');
      } else {
        newSubject = oldSubject;
      }
      setEmailSubject(task.taskSid, newSubject || '');
      setEmailInReplyTo(task.taskSid, messageId);
    }
  };

  handleChangeSubject = e => {
    const { task, setEmailSubject } = this.props;
    setEmailSubject(task.taskSid, e.target.value);
  };

  handleChangeBody = e => {
    const { task, setEmailBody } = this.props;
    setEmailBody(task.taskSid, e.target.value);
  };

  handleAttachmentSelected = file => {
    const { task, setEmailAttachment } = this.props;

    const reader = new FileReader();
    reader.onload = event =>
      setEmailAttachment(task.taskSid, {
        name: file.name,
        data: event.target.result
      });
    reader.readAsDataURL(file);
  };

  handleClearAttachment = () => {
    const { task, setEmailAttachment } = this.props;
    setEmailAttachment(task.taskSid, undefined);
    Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
    this.setState({ error: false, errorMessage: '' });
  };

  uploadAttachment = async () => {
    const { email, chatChannel } = this.props;

    if (email.attachment) {
      try {
        return await AttachmentResource.create({
          channelSid: chatChannel.source.sid,
          attachment: email.attachment
        });
      } catch (e) {
        console.error('Failed to upload attachment', e);
        this.setState({
          error: true,
          errorMessage: e.message,
          uploading: false
        });

        const errorMessage = 'Failed to upload attachment.';
        Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
        throw e;
      }
    }
  };

  handleInsertResponse = (newBody, newCursorPosition) => {
    const { task, setEmailBody } = this.props;
    setEmailBody(task.taskSid, newBody);
    // Small hack to focus input after render and restore the cursor position
    setTimeout(() => {
      const { current } = this.inputRef;
      // Set selection range, blur the focus to trick it to scroll cursor into view
      current.setSelectionRange(newCursorPosition, newCursorPosition);
      current.blur();
      current.focus();
    }, 0);
  };

  handleSend = async () => {
    const { task, chatChannel, email = {} } = this.props;
    const { error } = this.state;
    let { body = '', inReplyTo } = email;
    const { sid: channelSid } = chatChannel.source;

    const pattern = /\b(?:\d[ -]*?){15,16}\b/g;
    const shouldMaskText = pattern.test(body);

    if (shouldMaskText) {
      body = body.replace(pattern, '************');
    }

    if (!error) {
      try {
        this.setState({ uploading: !!email.attachment });
        const data = await this.uploadAttachment();
        const attachments = email.attachment
          ? [{ name: email.attachment.name, s3Key: data.s3Key }]
          : undefined;
        const channel = await manager.chatClient.getChannelBySid(channelSid);
        await channel.sendMessage(body, {
          source: 'outbound',
          subject: this.getReplySubject(),
          attachments,
          inReplyTo
        });
        this.setState({ uploading: false });
        Flex.Actions.invokeAction('WrapupTask', { task });
      } catch (e) {
        console.error(e);
        this.setState({
          error: true,
          errorMessage: e.message,
          uploading: false
        });

        const errorMessage = 'Failed to send attachment.';
        Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
      }
    } else {
      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_WARNING_NOTIFICATION);
    }
  };

  getReplySubject = () => {
    const { task, email = {} } = this.props;
    const { subject } = email;
    const { ticketNo } = task.attributes;

    const replyPart = `RE: #${ticketNo}`;

    if (subject) {
      if (subject.includes(replyPart)) {
        const fixedSubject = subject.replace(replyPart, '').trim();
        const replySubject = `${replyPart} ${fixedSubject}`;

        return replySubject;
      }

      return subject;
    }

    return replyPart;
  };

  getSubjectWithoutReply = () => {
    const { task, email = {} } = this.props;
    const { subject } = email;
    const { ticketNo } = task.attributes;

    if (subject) {
      const replyPart = `[EXTERNAL EMAIL] Re: #${ticketNo}`;
      const fixedSubject = subject.replace(replyPart, '').trim();

      return fixedSubject;
    }

    return '';
  };

  handlePostpone = async () => {
    const { task } = this.props;
    const worker = manager.workerClient;

    // an agent can only have 4 postponed tasks at once
    if (
      !worker.attributes.postponedCount ||
      worker.attributes.postponedCount < 4
    ) {
      let postponePeriods = task.attributes.postponePeriods || [];

      // an agent can only postpone a task 2 times
      if (postponePeriods.length < 2) {
        postponePeriods.push({
          startTime: Date.now()
        });
        task
          .setAttributes({
            ...task.attributes,
            postponePeriods,
            postponed: true
          })
          .then(() => Flex.Actions.invokeAction('PostponeTask', task));
      } else {
        Flex.Notifications.dismissNotificationById(
          POSTPONE_TASK_LIMIT_NOTIFICATION
        );
        Flex.Notifications.showNotification(
          POSTPONE_TASK_LIMIT_NOTIFICATION,
          null
        );
      }
    } else {
      Flex.Notifications.dismissNotificationById(
        POSTPONE_WORKER_LIMIT_NOTIFICATION
      );
      Flex.Notifications.showNotification(
        POSTPONE_WORKER_LIMIT_NOTIFICATION,
        null
      );
    }
  };

  render() {
    const { uploading, error, errorMessage } = this.state;
    const { classes, task, email = {} } = this.props;
    const { attributes } = task;
    const { brand } = attributes;
    const { body = '', subject, attachment } = email;
    const disableInputs = task.taskStatus !== TaskStatuses.assigned;

    if (subject !== '') {
      this.setSubjectAndInReplyTo();
    }

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <div className={classes.root}>
          {task.attributes.postponed && <PostponedScrim task={task} />}

          <Grid container item xs={12} alignItems="center">
            <Typography variant="overline" className={classes.titleText}>
              FROM:
            </Typography>
            <Typography variant="body2" className={classes.valueText}>
              {brand}
            </Typography>
          </Grid>

          <Grid
            container
            item
            xs={12}
            alignItems="center"
            className={classes.subjectItem}
          >
            <Typography variant="overline" className={classes.titleText}>
              SUBJECT:
            </Typography>

            <NMInput
              value={subject}
              onChange={this.handleChangeSubject}
              key={task.taskSid + '-subject'}
              className={classes.subject}
              disabled={disableInputs}
            />
          </Grid>

          <Grid container item xs={12}>
            <SlashInput
              fullWidth
              multiline
              rows={10}
              inputRef={this.inputRef}
              value={body}
              onChange={this.handleChangeBody}
              onInsertResponse={this.handleInsertResponse}
              disabled={disableInputs}
              key={task.taskSid + '-body'}
            />
          </Grid>

          {attachment && (
            <Grid
              container
              direction="column"
              item
              xs={12}
              className={classes.attachmentContainer}
            >
              <AttachmentItem
                attachment={attachment}
                canDelete={!uploading}
                isUploading={uploading}
                onClearAttachment={this.handleClearAttachment}
                errorProp={error}
                errorMessage={errorMessage}
                errorIcon={<ErrorIcon variant={'red'} />}
                key={attachment.name}
              />
            </Grid>
          )}

          <Grid container item xs={12} className={classes.btnContainer}>
            <AttachmentPicker
              onAttachmentSelected={this.handleAttachmentSelected}
              disabled={disableInputs || uploading}
            />

            <EmojiPicker
              key="emoji-picker"
              onEmojiSelected={this.handleEmojiSelected}
              task={task}
              disabled={disableInputs || uploading}
            />

            <div className={classes.btnSeparator} />

            <NMButton
              className={classes.postponeBtn}
              variant="grey"
              onClick={this.handlePostpone}
              disabled={disableInputs || uploading}
            >
              Postpone
            </NMButton>

            <NMButton
              disabled={!body || body === '' || disableInputs || uploading}
              onClick={this.handleSend}
            >
              Send
            </NMButton>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  email: state[REDUX_NAMESPACE].emails[ownProps.task.taskSid]
});

const mapDispatchToProps = dispatch => ({
  setEmailBody: bindActionCreators(Actions.setEmailBody, dispatch),
  setEmailAttachment: bindActionCreators(Actions.setEmailAttachment, dispatch),
  setEmailSubject: bindActionCreators(Actions.setEmailSubject, dispatch),
  setEmailInReplyTo: bindActionCreators(Actions.setEmailInReplyTo, dispatch)
});

export default Flex.withTaskContext(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EmailInput))
);
