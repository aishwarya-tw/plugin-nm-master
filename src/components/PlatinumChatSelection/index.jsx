import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import styles from './styles';

class PlatinumChatSelection extends Component {
  render() {
    const { classes, task } = this.props;
    const { attributes } = task;
    let { chatOption, isPlatinum } = attributes;

    return isPlatinum === 'true' && chatOption ? (
      <div className={classes.container}>
        <Typography className={classes.text}>{chatOption}</Typography>
      </div>
    ) : (
      ''
    );
  }
}

export default withStyles(styles)(PlatinumChatSelection);
