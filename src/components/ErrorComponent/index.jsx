import React, { Component } from 'react';

import { withStyles } from '@material-ui/core';

import styles from './styles';

class ErrorComponent extends Component {
  render() {
    const { classes, errorMessage, errorIcon } = this.props;
    return (
      <>
        <span className={classes.errorIcon}>{errorIcon && errorIcon}</span>
        <span className={classes.errorMessage}>{errorMessage} </span>
      </>
    );
  }
}

export default withStyles(styles)(ErrorComponent);
