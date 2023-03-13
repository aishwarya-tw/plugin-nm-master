import React, { Component } from 'react'
import styles from './styles'
import { Grid, Button, withStyles,ButtonBase } from "@material-ui/core";
import TransferAgentlist from '../TransferformQueue';
import CustomerMood from './CustomerMood';
import HighlightedMessage from './HighlightedMessage';
import { Notifications } from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as ChatActions } from '../../states/ChatTransferReducer';
import { Actions as ToolActions } from '../../states/ToolsReducer';
import { REDUX_NAMESPACE } from '../../utils/constants';
import { GENERAL_ERROR_NOTIFICATION } from '../../utils/constants';
const reasons = require('./ReasonsForContact.json')
const list = Object.values(reasons.options);

class TransferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderForm: false,
      note: "",
      contactReason: "",
      customerMood: "",
    }
  }
  componentDidMount = () => {

  }
  handleMood = (mood) => {
    this.setState({ customerMood: mood });
  }
  handleExit = () =>{
    const {task,setCurrentTool } = this.props;
    setCurrentTool(task.taskSid, '/responses')
  }
  handleFormChange = (event) => {
    this.setState({
      note: event.target.value
    })
  }
  handleReason = (event) => {
    this.setState({
      contactReason: event.target.value
    })
  }

  render() {
    const { classes, selectedMessages, task } = this.props
    const highlightedMessages = selectedMessages[task.taskSid] || [];
    console.log("Current Details: " + [this.state.contactReason, this.state.note, this.state.customerMood])
    return (
      <div className={classes.div}>
        <div className={classes.row}>
          <div className={classes.column1}>
            <ButtonBase onClick={this.handleExit} className={classes.exitFormButton}>
            <span style={{color:"black"}}> X</span>
          </ButtonBase>
            <h3 className={classes.h2line}>Transfer Details</h3>
           

            <div className={classes.div}>
              <h3 className={classes.h3line}> Reasons For Contact</h3>
              <select onChange={this.handleReason} className={classes.select}>
              <option value="" disabled selected> Select</option>
                {list.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className={classes.div}>
              <h3 className={classes.h3}>Add Note (200 character limit)</h3>
              <textarea maxLength = {200} onChange={this.handleFormChange} className={classes.textArea}></textarea>
            </div>
            <div className={classes.div}>
              <h3 className={classes.h3}>  Customer Interaction</h3>
              
              <CustomerMood
                value={this.state.customerMood}
                onClick={this.handleMood}
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
                {highlightedMessages.map(message => (
                  <Grid item key={message.index}>
                    <HighlightedMessage
                      message={message}
                      taskSid={task.taskSid}
                      onClick={this.props.updateSelectedMessages}
                      isSelectable
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
            <Grid container justify="center">
              <Button variant='contained' className={classes.agentButton}
                onClick={() => {
                  //Initial check to see if required fields are not empty before we allow the Queue to render
                  if( this.state.note == '' || this.state.contactReason == ''){
                  Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
                    errorMessage: `Reason for Contact and Note are REQUIRED.`
                  })
                  return
                } 
                  this.setState(prevState => ({
                    renderForm: !prevState.renderForm
                  }))
                
                }}
              >
                ASSIGN TO AGENT
              </Button>
            </Grid>
          </div>
          <div className={classes.column2}>

            {
              
              this.state.renderForm ?
                <TransferAgentlist
                  note={this.state.note}
                  contactReason={this.state.contactReason}
                  customerMood={this.state.customerMood}
                  task={this.props.task}
                  messages={highlightedMessages.map(msg => msg.index)}
                />
                : null
            }
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  selectedMessages: state[REDUX_NAMESPACE].chatTransfer.selectedMessages,
});

const mapDispatchToProps = dispatch => ({
  updateSelectedMessages: bindActionCreators(ChatActions.updateSelectedMessages, dispatch),
  setCurrentTool: bindActionCreators(ToolActions.setCurrentTool,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TransferForm));
