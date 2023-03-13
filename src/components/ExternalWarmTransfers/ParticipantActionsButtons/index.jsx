import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles';
import { withStyles } from '@material-ui/core';

import {
  Actions,
  IconButton,
  VERSION as FlexVersion
} from '@twilio/flex-ui';

class ParticipantActionsButtons extends React.Component {
  componentWillUnmount() {
    const { participant } = this.props;
    if (participant.status === 'recently_left') {
      this.props.clearParticipantComponentState();
    }
  }

  showKickConfirmation = () => this.props.setShowKickConfirmation(true);

  hideKickConfirmation = () => this.props.setShowKickConfirmation(false);

  onHoldParticipantClick = () => {
    const { participant, task } = this.props;
    const { callSid } = participant;
    const participantType = participant.participantType;
    Actions.invokeAction(
      participant.onHold ? 'UnholdParticipant' : 'HoldParticipant',
      {
        participantType,
        task,
        targetSid: callSid
      }
    );
  };

  onKickParticipantConfirmClick = () => {
    const { participant, task } = this.props;
    const { participantType, workerSid } = participant;
    
    if (participantType === "transfer") {
      Actions.invokeAction(
        'CancelTransfer',
        {
          task,
          targetSid: workerSid
        }
      );
    } else {
      Actions.invokeAction(
        'KickParticipant',
        {
          task,
          participant,
        }
      );
    }

    this.hideKickConfirmation();
  };

  renderKickConfirmation() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <IconButton
          icon="Accept"
          className={classes.button}
          onClick={this.onKickParticipantConfirmClick}
          themeOverride={
            this.props.theme.ParticipantsCanvas.ParticipantCanvas.Button
          }
        />
        <IconButton
          icon="Close"
          className={classes.button}
          onClick={this.hideKickConfirmation}
          themeOverride={
            this.props.theme.ParticipantsCanvas.ParticipantCanvas.Button
          }
        />
      </React.Fragment>
    );
  }

  renderActions() {
    const { participant, theme, classes } = this.props;

    const holdParticipantTooltip = participant.onHold
      ? 'Unhold Participant'
      : 'Hold Participant';
    const kickParticipantTooltip = 'Remove Participant';

    // The name of the hold icons changed in Flex 1.11.0 to HoldOff.
    // Since the minimum requirement is 1.10.0 and there is no version between
    // 1.10.0 and 1.11.0, the check is only needed for version 1.10.0.
    const holdIcon = FlexVersion === '1.10.0' ? 'HoldLarge' : 'Hold';
    const unholdIcon = FlexVersion === '1.10.0' ? 'HoldLargeBold' : 'HoldOff';

    return (
      <React.Fragment>
        <IconButton
          icon={participant.onHold ? `${unholdIcon}` : `${holdIcon}`}
          className={classes.button}
          disabled={participant.connecting === true}
          onClick={this.onHoldParticipantClick}
          themeOverride={theme.ParticipantsCanvas.ParticipantCanvas.Button}
          title={holdParticipantTooltip}
        />
        <IconButton
          icon="Hangup"
          className={classes.button}
          onClick={this.showKickConfirmation}
          themeOverride={
            theme.ParticipantsCanvas.ParticipantCanvas.HangUpButton
          }
          title={kickParticipantTooltip}
        />
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    return this.props.listMode ? (
      <div className={classes.actionsContainerListItem}>
        {this.props.showKickConfirmation
          ? this.renderKickConfirmation()
          : this.renderActions()}
      </div>
    ) : (
      <div className={classes.actionsContainer}>
        {this.props.showKickConfirmation
          ? this.renderKickConfirmation()
          : this.renderActions()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { participant } = ownProps;
  const componentViewStates = state.flex.view.componentViewStates;
  const customParticipants = componentViewStates.customParticipants || {};
  const participantState = customParticipants[participant.callSid] || {};
  const customParticipantsState = {};

  return {
    showKickConfirmation: participantState.showKickConfirmation,
    setShowKickConfirmation: value => {
      customParticipantsState[participant.callSid] = {
        ...participantState,
        showKickConfirmation: value
      };
      Actions.invokeAction('SetComponentState', {
        name: 'customParticipants',
        state: customParticipantsState
      });
    },
    clearParticipantComponentState: () => {
      customParticipantsState[participant.callSid] = undefined;
      Actions.invokeAction('SetComponentState', {
        name: 'customParticipants',
        state: customParticipantsState
      });
    }
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(ParticipantActionsButtons)
);
