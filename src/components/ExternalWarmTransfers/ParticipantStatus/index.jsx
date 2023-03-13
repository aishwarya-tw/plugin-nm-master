import * as React from 'react';
import { connect } from 'react-redux';
import { templates, Template } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import styles from './styles';
class ParticipantStatus extends React.PureComponent {
  render() {
    const { participant, classes } = this.props;
    let statusTemplate = templates.CallParticipantStatusLive;

    if (participant.onHold) {
      statusTemplate = templates.CallParticipantStatusOnHold;
    }
    if (participant.status === 'recently_left') {
      statusTemplate = templates.CallParticipantStatusLeft;
    }
    if (participant.connecting) {
      statusTemplate = templates.CallParticipantStatusConnecting;
    }
    if (this.props.showKickConfirmation) {
      statusTemplate = templates.CallParticipantStatusKickConfirmation;
    }

    return this.props.listMode ? (
      <div className={classes.StatusListItem}>
        <Template source={statusTemplate} />
      </div>
    ) : (
      <div className={classes.status}>
        <Template source={statusTemplate} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { participant } = ownProps;
  const componentViewStates = state.flex.view.componentViewStates;
  const customParticipants = componentViewStates.customParticipants || {};
  const participantState = customParticipants[participant.callSid];

  return {
    showKickConfirmation:
      participantState && participantState.showKickConfirmation
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ParticipantStatus));
