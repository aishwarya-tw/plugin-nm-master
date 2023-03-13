import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';

import TopBar from '../TopBar';
import styles from './styles';

class PoliciesPortal extends Component {
  render() {
    const { taskSid } = this.props;

    return (
      <div>
        <TopBar taskSid={taskSid} />
        frequent policies
      </div>
    );
  }
}

export default withStyles(styles)(PoliciesPortal);
