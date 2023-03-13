import * as React from 'react';
import ParticipantName from '../ParticipantName';
import ParticipantStatus from '../ParticipantStatus';
import styles from './styles';
import { withStyles } from '@material-ui/core';

class ParticipantStatusContainer extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.statusContainer}>
        <ParticipantName key="custom-name" {...this.props} />
        <ParticipantStatus key="custom-status" {...this.props} />
      </div>
    );
  }
}

export default withStyles(styles)(ParticipantStatusContainer);
