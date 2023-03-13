import React from 'react';
import { connect } from 'react-redux';
import { Actions, Manager, withTheme } from '@twilio/flex-ui';
import { 
  Button,
  Dialog, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem 
} from "@material-ui/core";
import ConferenceService from '../../services/ConferenceService';

class StoreTransferDialog extends React.Component {
  state = {
    transferTo: '',
    transferType: 'warm'
  };

  handleClose = () => {
    this.closeDialog();
  };

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'StoreTransferDialog',
      state: { isOpen: false }
    });
  };

  handleStoreSelect = e => {
    const { value } = e.target;
    this.setState({ transferTo: value });
  }

  handleRadioChange = e => {
    const { value } = e.target;
    this.setState({ transferType: value });
  };

  handleTransferButton = () => {
    this.transferToStore();
    this.closeDialog();
  }

  transferToStore = async () => {
    const to = this.state.transferTo;
    const {
      task,
      task: { taskSid }
    } = this.props;
    const mngr = Manager.getInstance();
    const fromOutbound = mngr.serviceConfiguration.attributes.NMG.from;

    //const from = task.attributes.from || task.attributes.called;
    const from = fromOutbound;
    const { sid: conferenceSid, participants } = task.attributes.conference;
    let workerSid = mngr.workerClient.sid;
    console.log("storeTransferDialog workersid:", workerSid);
    console.log("reservation sid:",task._task.reservationSid);

    //get store name
    const manager = Manager.getInstance();
    const { storeDirectory } = manager.serviceConfiguration.attributes.NMG;
    let stores = Object.entries(storeDirectory);
    let filtered = Object.values(stores).filter(entry =>
      entry[1].phone.includes(to)
    );
    console.log("store name=", filtered[0][0]);
    let storeName=filtered[0][0] ? filtered[0][0]:"";
    let transferType = this.state.transferType.toUpperCase()

    let participantCallSid;
    let currentQueueName = localStorage.getItem('CurrentQueueName') || task.queueName;
    console.log("currentQueueName:",currentQueueName);
    try {
      await ConferenceService.holdParticipant(conferenceSid, participants.customer);

      participantCallSid = await ConferenceService.addParticipant(
        taskSid,
        from,
        to,
        conferenceSid,
        transferType,
        storeName,
        workerSid,
        task._task.reservationSid,
        currentQueueName
      );

      ConferenceService.addConnectingParticipant(
        conferenceSid,
        participantCallSid,
        'unknown'
      );

      if (this.state.transferType === 'cold') {
        await ConferenceService.setEndConferenceOnExit(conferenceSid, participants.worker, false);
        await ConferenceService.removeParticipant(conferenceSid, participants.worker);
        await ConferenceService.setEndConferenceOnExit(conferenceSid, participantCallSid, true);
        await ConferenceService.unholdParticipant(conferenceSid, participants.customer);
      }
    } catch (error) {
      console.error('Error adding conference participant:', error);
    }
    this.setState({ transferTo: '' });
  }

  populateStoreSelect = (directory) => {
    return Object.entries(directory)
      .sort(([a, b], [c, d]) => (b.store > d.store) ? 1 : -1)  
      .map(([storeName, storeDetails]) => (
        <MenuItem value={storeDetails.phone}>
          {storeName} ({storeDetails.store})
        </MenuItem>
    ));
  }

  render () {
    const manager = Manager.getInstance();
    const { storeDirectory } = manager.serviceConfiguration.attributes.NMG;

    return (
      <Dialog open={this.props.isOpen} onClose={this.closeDialog}>
        <DialogContent>
          <DialogContentText>
            Transfer to store
          </DialogContentText>
          <FormControl>
            <Select value={this.state.transferTo} onChange={this.handleStoreSelect}>
              { this.populateStoreSelect(storeDirectory) }
            </Select>
            <br/>
            <br/>
            <FormLabel component="legend">Transfer type</FormLabel>
            <RadioGroup
              value={this.state.transferType}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel value="warm" control={<Radio />} label="Warm" />
              <FormControlLabel value="cold" control={<Radio />} label="Cold" />
            </RadioGroup>
            <br/>
            <DialogActions>
              <Button onClick={this.closeDialog} color="secondary">Cancel</Button>
              <Button
                onClick={this.handleTransferButton}
                disabled={this.state.transferTo === ''}
                color="primary"
              >
                Transfer
              </Button>
            </DialogActions>
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates;
  const storeTransferDialogState =
    componentViewStates && componentViewStates.StoreTransferDialog;
  const isOpen = storeTransferDialogState && storeTransferDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(StoreTransferDialog));
