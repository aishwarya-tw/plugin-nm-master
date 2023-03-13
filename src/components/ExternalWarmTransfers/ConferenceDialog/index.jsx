import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager } from '@twilio/flex-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import ConferenceService from '../../../services/ConferenceService';

class ConferenceDialog extends React.Component {
  state = {
    conferenceTo: '',
    numberIsValid: false
  };

  handleClose = () => {
    this.closeDialog();
  };

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false }
    });
  };

  handleKeyPress = e => {
    const key = e.key;

    if (key === 'Enter') {
      this.addConferenceParticipant();
      this.closeDialog();
    }
  };

  handleChange = e => {
    const value = e.target.value;
    // Regex will only allow numbers and an optional "+" in the beginning
    let onlyNumbers = value.replace(/[^0-9]/g, '');
    let formattedNumber = value.startsWith('+')
      ? `+${onlyNumbers}`
      : onlyNumbers;
    (formattedNumber.length === 11 && formattedNumber.startsWith('1')) ||
    (formattedNumber.length === 12 && formattedNumber.startsWith('+1'))
      ? this.setState({ numberIsValid: true })
      : this.setState({ numberIsValid: false });
    this.setState({ conferenceTo: formattedNumber });
  };

  handleDialButton = () => {
    this.addConferenceParticipant();
    this.closeDialog();
  };

  addConferenceParticipant = async () => {
    const to = this.state.conferenceTo;
    const {
      task,
      task: { taskSid }
    } = this.props;

    const mngr = Manager.getInstance();
    const fromOutbound = mngr.serviceConfiguration.attributes.NMG.from;
    let workerSid = mngr.workerClient.sid;
    console.log("external warm workersid:", workerSid);
    console.log("reservation sid:",task._task.reservationSid);

    //const from = task.attributes.from || task.attributes.called;
    const from = fromOutbound;
    const conference = task && (task.conference || {});
    const { conferenceSid } = conference;

    // Adding entered number to the conference
    console.log(`Adding ${to} to conference`);
    let participantCallSid;
    let currentQueueName = localStorage.getItem('CurrentQueueName') || task.queueName;
    console.log('currentQueueName:', currentQueueName);
    try {
      participantCallSid = await ConferenceService.addParticipant(
        taskSid,
        from,
        to,
        conferenceSid,
        "WARM",
        "", //store name
        workerSid,
        task._task.reservationSid,
        currentQueueName
      );
      ConferenceService.addConnectingParticipant(
        conferenceSid,
        participantCallSid,
        'unknown'
      );
    } catch (error) {
      console.error('Error adding conference participant:', error);
    }
    this.setState({ conferenceTo: '' });
  };

  render() {
    return (
      <Dialog open={this.props.isOpen} onClose={this.handleClose}>
        <DialogContent>
          <DialogContentText>
            Enter phone number to add to the conference
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="conferenceNumber"
            label="Phone Number"
            fullWidth
            value={this.state.conferenceTo}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleDialButton}
            color="primary"
            disabled={!this.state.numberIsValid}
          >
            Dial
          </Button>
          <Button onClick={this.closeDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const conferenceDialogState =
    componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = conferenceDialogState && conferenceDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(ConferenceDialog));
