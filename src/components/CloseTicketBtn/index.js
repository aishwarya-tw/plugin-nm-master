import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import { MuiThemeProvider, withStyles } from '@material-ui/core';

import styles from './styles';
import defaultTheme from '../../themes/defaultTheme';

class CloseTicketBtn extends Component {
  handleCloseTicket = () => {
    const { task } = this.props;
    const { taskChannelUniqueName } = task;

    task.setAttributes({
      ...task.attributes,
      cdtRequired: true
    });

    Flex.Actions.invokeAction('WrapupTask', {
      task
    });

    if (taskChannelUniqueName === 'voice') {
      Flex.Actions.invokeAction('HangupCall', {
        task
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <div className={classes.root}>
          <Flex.Button
            className={classes.closeTicketBtn}
            onClick={this.handleCloseTicket}
          >
            <span>CLOSE TICKET</span>
          </Flex.Button>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(CloseTicketBtn);
