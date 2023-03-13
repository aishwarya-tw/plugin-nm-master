import React, { Component } from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import styles from '../styles';
import { Grid, Button, withStyles,ButtonBase } from '@material-ui/core';
import HighlightedMessage from '../HighlightedMessage';
import CustomerMood from '../CustomerMood';
import { UserCard, Manager, StateHelper } from '@twilio/flex-ui';
import { Actions as ToolActions } from '../../../states/ToolsReducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ReadOnlyTransferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { task, chat } = this.props;
    const { messages } = this.state;
    const { highlightMessages } = task.attributes.transfer;
    const { channelSid } = task.attributes;
    const chatMessages = chat?.channels[channelSid]?.messages;

    if (
      chatMessages?.length > 0 &&
      messages.length === 0 &&
      highlightMessages?.length > 0
    ) {
      this.setState({
        messages: highlightMessages.map(index => chatMessages[index])
      });
    }
  }

  handleExit = () => {
    const { task, setCurrentTool } = this.props;
    setCurrentTool(task.taskSid, '/responses');
  }

  render() {
    const { task, classes } = this.props;
    const { transfer } = this.props.task.attributes;
    const { messages } = this.state;
    const { prevAgentIdentity, customerInteraction } = task.attributes.transfer;

    return (
      <div className={classes.div}>
        <div className={classes.row}>
        <div className={classes.column1}>
        <ButtonBase onClick={this.handleExit} className={classes.exitFormButton}>
        <span style={{color: "black"}}> X</span>
          </ButtonBase>
          <h3 className={classes.header}>Transfer Details</h3>
          <div className={classes.div}>
            <h3 className={classes.h3}>Assign By</h3>
            <div className={classes.assignedByColor}>
              <UserCard
                className="Twilio-Icon Twilio-Icon-Agent"
                firstLine={transfer.from}
                large
              />
            </div>
          </div>
          <div className={classes.div}>
            <h3 className={classes.h3}> Reasons For Contact</h3>
            <select className={classes.select}>
              <option value="" disabled selected>
                {transfer.reasonForContact}
              </option>
            </select>
          </div>
          <div className={classes.div}>
            <h3 className={classes.h3}>Add Note (200 character limit)</h3>
            <textarea readOnly className={classes.textArea}>
              {transfer.note}
            </textarea>
          </div>
          <div className={classes.div}>
            <h3 className={classes.h3}> Customer Interaction</h3>
            <CustomerMood
              value={customerInteraction}
              onClick={() => {}}
              disabled
            />
          </div>
          <div className={classes.div}>
            <h3 className={classes.h3}> Highlighted Messages</h3>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              {messages.map(message => (
                <Grid item key={message.index}>
                  <HighlightedMessage
                    message={message}
                    previousAgent={prevAgentIdentity}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chat: state.flex.chat,
});

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(ToolActions.setCurrentTool, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTaskContext(withStyles(styles)(ReadOnlyTransferForm)));
