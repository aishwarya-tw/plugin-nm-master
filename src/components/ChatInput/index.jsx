import React, { Component } from 'react';

import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ChatInputReducer';

import { MuiThemeProvider, Grid, Divider, withStyles } from '@material-ui/core';
import styles from './styles';
import defaultTheme from '../../themes/defaultTheme';

import NMIconButton from '../NMIconButton';
import EmojiPicker from '../EmojiPicker';
import AttachmentPicker from '../AttachmentPicker';
import AttachmentItem from '../AttachmentItem';
import SendIcon from '../../assets/SendIcon';
import SlashInput from '../SlashInput';
import SlashInputWithSmartCompose from './SlashInputWithSmartCompose';
import ErrorIcon from '../../assets/ErrorIcon';
import PlatinumChatSelection from '../PlatinumChatSelection';
import TransferButton from '../ChatTransferButton';
import Resource from '../../utils/resource';
import {
  REDUX_NAMESPACE,
  BACKEND_ERROR_NOTIFICATION,
  BACKEND_WARNING_NOTIFICATION
} from '../../utils/constants';
import { isPlatImageSupported } from '../../utils/helpers';
import { TaskStatuses, ChannelTypes } from '../../utils/constants';
import { hasWorkEnabledCresta } from '../../utils/cresta';

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.chatClient = Flex.Manager.getInstance().chatClient;
    const { worker } = Flex.Manager.getInstance().store.getState().flex;
    this.state = {
      error: false,
      errorMessage: '',
      uploading: false,
      webchatTypingActionPending: false,
      disabled: false,
      disableCresta:
        !customElements.get('cresta-smart-compose') ||
        !hasWorkEnabledCresta(worker) ||
        !(this.isWebChat || this.isSMS)
    };
    this.inputRef = props.chatInputRef
    this.processPaste = this.processPaste.bind(this);
    this.onClickTransferButton = props.onClickTransferButton
  }

  processPaste(pasteEvent){
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

  get crestaEnabled() {
    return !this.props.disableCresta && !this.state.disableCresta;
  }

  get isWebChat() {
    const { task } = this.props;
    return (
      task &&
      task.attributes &&
      task.attributes.channelType === ChannelTypes.chat
    );
  }

  get isSMS() {
    const { task } = this.props;
    return (
      task &&
      task.attributes &&
      task.attributes.channelType === ChannelTypes.sms
    );
  }

  handleEmojiSelected = emoji => {
    if (this.inputRef.current.insertValueAtCursor && this.crestaEnabled) {
      // Cresta Smart Compose
      this.inputRef.current.insertValueAtCursor(emoji);
    } else {
      const { task, chatInput = {}, setInputText } = this.props;
      const { inputText = '' } = chatInput;
      const selectionStart = this.inputRef.current.selectionStart;
      const selectionEnd = this.inputRef.current.selectionEnd;
      const startSlice = inputText.substring(0, selectionStart);
      const endSlice = inputText.substring(selectionEnd);
      const newInputText = `${startSlice}${emoji}${endSlice}`;
      setInputText(task.taskSid, newInputText);
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
    }
  };

  uploadAttachment = async (channelSid, attachment) => {
    if (attachment) {
      try {
        return await Resource('save-attachment').create({
          channelSid,
          attachment
        });
      } catch (e) {
        console.error('Failed to upload attachment', e);
        const errorMessage = 'Failed to upload attachment';
        Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
        this.setState({
          error: true,
          errorMessage: e.message,
          uploading: false // We have to set uploading to false when we encounter an error so that we don't get stuck in uploading loop
        });
        throw e;
      }
    }
  };

  handleAttachmentSelected = file => {
    const { task, setAttachment } = this.props;
    const { attributes } = task;
    const { isPlatinum } = attributes;

    if (isPlatinum === 'true' && !isPlatImageSupported(file)) {
      this.setState({
        error: true,
        errorMessage: 'File type is not supported'
      });
    }

    if (isPlatinum && isPlatinum === 'true') {
      setAttachment(task.taskSid, file);
    } else {
      const { name } = file;
      const reader = new FileReader();
      reader.onload = event => {
        const { result: data } = event.target;
        setAttachment(task.taskSid, { name, data });
      };
      reader.readAsDataURL(file);
    }
  };

  handleClearAttachment = () => {
    const { task, setAttachment } = this.props;
    setAttachment(task.taskSid, undefined);
    Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
    this.setState({ error: false, errorMessage: '' });
  };

  handleInputChange = event => {
    const { channelSid, channel, task, setInputText } = this.props;
    const { webchatTypingActionPending } = this.state;
    const { channelType } = task.attributes;
    setInputText(task.taskSid, event.target.value);
    if (channelType === ChannelTypes.chat) {
      if (!webchatTypingActionPending && channel.members.size > 1) {
        this.setState({ webchatTypingActionPending: true });
        Flex.Actions.invokeAction('SendTyping', { channelSid }).then(() => {
          this.setState({ webchatTypingActionPending: false });
        });
      }
    }
  };

  handleInsertResponse = (newInputText, newCursorPosition) => {
    const { task, setInputText } = this.props;
    setInputText(task.taskSid, newInputText);
    if (this.crestaEnabled) {
      this.inputRef.current.value = newInputText;
    } else {
      // Small hack to focus input after render and restore the cursor position
      setTimeout(() => {
        const { current } = this.inputRef;
        // Set selection range, blur the focus to trick it to scroll cursor into view
        current.setSelectionRange(newCursorPosition, newCursorPosition);
        current.blur();
        current.focus();
      }, 0);
    }
  };

  // Handler used by cresta smart compose.
  handleSubmitted = event => {
    const { disabled, uploading } = this.state;
    if (!disabled || !uploading) {
      this.sendText(event.target.value);
    }
  };

  handleKeyPress = event => {
    if (this.crestaEnabled) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const { disabled, uploading } = this.state;
      event.preventDefault();
      if (!disabled || !uploading) {
        this.handleSend();
      }
    }
  };

  handleSend = () => {
    if (this.crestaEnabled) {
      this.inputRef.current.submit();
    } else {
      const { chatInput = {} } = this.props;
      this.sendText(chatInput.inputText || '');
    }
  };

  sendText = async inputText => {
    const { task, chatChannel, chatInput = {}, messageSent } = this.props;
    const {
      phoneNum,
      to: flexNumber,
      channelType,
      isPlatinum
    } = task.attributes;
    let { attachment } = chatInput;
    const { sid: channelSid } = chatChannel.source;
    const { error } = this.state;

    const pattern = /\b(?:\d[ -]*?){15,16}\b/g;
    const shouldMaskText = pattern.test(inputText);

    if (shouldMaskText) {
      inputText = inputText.replace(pattern, '************');
    }

    if (!error) {
      try {
        this.setState({ disabled: true });

        let attachments;
        if (attachment) {
          this.setState({ uploading: true });
          if (!isPlatinum) {
            const data = await this.uploadAttachment(channelSid, attachment); // this is the S3 Load <<< start here
            attachments = [{ name: attachment.name, s3Key: data.s3Key }];
          }
        }
        const channel = await this.chatClient.getChannelBySid(channelSid);
        if (inputText && inputText.length && inputText !== ' ') {
          if (isPlatinum && isPlatinum === 'true' && attachment) {
            Flex.Actions.invokeAction('SendMediaMessage', {
              file: attachment,
              channelSid: channelSid
            });
            Flex.Actions.invokeAction('SendMessage', {
              body: inputText,
              channelSid: channelSid
            });
          } else {
            await channel.sendMessage(inputText, { attachments });
          }
          messageSent(task.taskSid);
          this.setState({ uploading: false });
          if (attachments && channelType === ChannelTypes.sms) {
            try {
              const mms = { attachments, flexNumber, phoneNum };
              const response = await Resource('outbound-mms').create(mms);
              console.log('SENT MMS: ', response);
              this.setState({ disabled: false });
            } catch (e) {
              console.error('FAILED OUTBOUND MMS: ', e);
              this.setState({
                error: true,
                errorMessage: e.message,
                uploading: false,
                disabled: false
              });

              const errorMessage = 'Failed to send outbound MMS';

              Flex.Notifications.dismissNotificationById(
                BACKEND_ERROR_NOTIFICATION
              );
              Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
                errorMessage
              });
            }
          }
        }

        setTimeout(() => {
          this.setState({ disabled: false });
        }, 400);
      } catch (e) {
        console.error(e);
        this.setState({
          error: true,
          errorMessage: e.message,
          uploading: false,
          disabled: false
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
      this.setState({
        disabled: false
      });
    }
  };

  render() {
    const { classes, task, chatInput = {}, chatChannel } = this.props;
    const { attachment, inputText = '' } = chatInput;
    const enableDigitalTransfers = task.attributes.enableDigitalTransfers === 'true'
    const { uploading, error, errorMessage, disabled } = this.state;
    const disableInputs = task.taskStatus !== TaskStatuses.assigned;
    const { sid: channelSid } = chatChannel.source;
    const isWebChat = this.isWebChat;
    const disableTransfer = (task.taskChannelUniqueName !=='chat' && 
    task.taskChannelUniqueName !== 'voice');
    console.log('props >>>', this.props);

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <div className={classes.root}>
          <Divider className={classes.chatDivider} />
          <PlatinumChatSelection className="plat-chat-select" task={task} />
          {this.crestaEnabled ? (
            <SlashInputWithSmartCompose
              chatId={channelSid}
              inputRef={this.inputRef}
              value={inputText}
              disabled={disableInputs || disabled}
              onChange={this.handleInputChange}
              onSubmitted={this.handleSubmitted}
              onInsertResponse={this.handleInsertResponse}
              key={`${task.taskSid}-chat-input`}
            />
          ) : (
            <SlashInput
              fullWidth
              multiline
              rowsMax="5"
              value={inputText}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleInputChange}
              onInsertResponse={this.handleInsertResponse}
              disabled={disableInputs || disabled}
              inputRef={this.inputRef}
              className={classes.nmInput}
              InputProps={{ className: classes.textArea }}
              key={`${task.taskSid}-chat-input`}
            />
          )}
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
                errorIcon={<ErrorIcon variant={'red'} />}
                errorMessage={errorMessage}
                key={attachment.name}
              />
            </Grid>
          )}
          <div className={classes.btnContainer}>
            <div className={classes.pickerButtons}>
              <AttachmentPicker
                onAttachmentSelected={this.handleAttachmentSelected}
                onClearAttachment={this.handleClearAttachment}
                disabled={disabled || disableInputs || uploading}
              />
              <EmojiPicker
                key="emoji-picker"
                onEmojiSelected={this.handleEmojiSelected}
                task={task}
                disabled={disabled || disableInputs || uploading}
              />
              {// Add Transfer Button for only WebChat Tasks
              // Flag Added to the Webchat Flow Studio Flow which we can use to enable/disable the Transfer Option
              (isWebChat && enableDigitalTransfers) ? 
              <TransferButton
              task={task}
              channelSid= {channelSid}
              disabled={disabled || disableInputs || uploading || disableTransfer}
              /> 
              :null
  }
  
            </div>
            <div className={classes.sendBtnContainer}>
              <NMIconButton
                icon={<SendIcon />}
                disabled={disabled || !inputText || disableInputs || uploading}
                onClick={this.handleSend}
                
              />
              
              
              
            </div>
            
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  chatInput: state[REDUX_NAMESPACE].chatInput[ownProps.task.taskSid]
});

const mapDispatchToProps = dispatch => ({
  setInputText: bindActionCreators(Actions.setInputText, dispatch),
  setAttachment: bindActionCreators(Actions.setAttachment, dispatch),
  messageSent: bindActionCreators(Actions.messageSent, dispatch)
});

export default Flex.withTaskContext(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChatInput))
);
