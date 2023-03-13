import React, { Component, Fragment } from 'react';
import * as Flex from '@twilio/flex-ui';

import { Typography, withStyles } from '@material-ui/core';
import styles from './styles';

class HeaderText extends Component {
  render() {
    const {
      account_sid: accountSid
    } = Flex.Manager.getInstance().serviceConfiguration;
    let environment;
    if (accountSid === 'AC614ccf8ec78d6f1a6d183b32f3474a33') {
      environment = 'development';
    }

    if (accountSid === 'ACc133a04a6be60bee3bc21c7272407cd4') {
      environment = 'qa';
    }

    if (accountSid === 'ACa01e8ddd02c436753437aba23bd0281f') {
      environment = 'preprod';
    }

    if (accountSid === 'ACdd86b3a7f858f6f4672f54755ce42a7c') {
      environment = '';
    }

    const environmentName = `${environment} environment`;

    const { classes } = this.props;
    return (
      <Fragment>
        <Typography className={classes.text}>
          <span className={classes.brand}>Neiman Marcus</span> Customer Care{' '}
          {environment ? environmentName : ''}
        </Typography>
      </Fragment>
    );
  }
}

export default withStyles(styles)(HeaderText);
