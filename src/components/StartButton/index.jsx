import React, { Component } from 'react';
import { Actions } from '@twilio/flex-ui';

import { withStyles } from '@material-ui/core';
import styles from './styles';

import NMIconButton from '../NMIconButton';
import PlayIcon from '../../assets/PlayIcon';

class StartButton extends Component {
  handleClick = e => {
    e.stopPropagation();
    const { task } = this.props;
    Actions.invokeAction('AcceptTask', { task }).then(() =>
      Actions.invokeAction('SelectTask', { task })
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <NMIconButton
        icon={<PlayIcon variant="white" />}
        variant="green"
        onClick={this.handleClick}
        className={classes.btn}
      />
    );
  }
}

export default withStyles(styles)(StartButton);
