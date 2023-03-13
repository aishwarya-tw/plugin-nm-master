import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import { Grid, Typography, withStyles } from '@material-ui/core';
import styles from './styles';

class PostponedScrim extends Component {
  handleResume = () => {
    const { task } = this.props;
    let postponePeriods = task.attributes.postponePeriods;
    let unfinished = postponePeriods.find(period => !period.endTime);

    if (unfinished) {
      unfinished.endTime = Date.now();
      task
        .setAttributes({
          ...task.attributes,
          postponePeriods,
          postponed: false
        })
        .then(() => Flex.Actions.invokeAction('ResumeTask', task));
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        className={classes.root}
      >
        <Typography variant="h6" className={classes.header}>
          This task is currently postponed
        </Typography>
        <Flex.Button onClick={this.handleResume} className={classes.btn}>
          RESUME
        </Flex.Button>
      </Grid>
    );
  }
}

export default withStyles(styles)(PostponedScrim);
