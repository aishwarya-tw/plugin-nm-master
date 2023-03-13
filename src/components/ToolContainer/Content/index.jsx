import React, { Component } from 'react';

import clsx from 'clsx';
import { MuiThemeProvider, withStyles } from '@material-ui/core';
import styles from './styles';
import defaultTheme from '../../../themes/defaultTheme';

import TopBar from '../../TopBar';

class Content extends Component {
  render() {
    const { taskSid, children, classes, className } = this.props;
    return (
      <MuiThemeProvider theme={defaultTheme}>
        <div className={clsx(classes.container, className)}>
          <TopBar taskSid={taskSid} />
          <div className={classes.content}>{children}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Content);
