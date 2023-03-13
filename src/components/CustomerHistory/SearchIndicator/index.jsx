import React, { Component } from 'react';
import {
  Typography,
  withStyles,
  CircularProgress,
  Grid
} from '@material-ui/core';
import styles from './styles';

class SearchIndicator extends Component {
  render() {
    const { classes, message } = this.props;
    return (
      <div className={classes.root}>
        <Grid container align="center">
          <Grid item xs={12}>
            <Typography variant="overline" className={classes.message}>
              {message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CircularProgress className={classes.spinner} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SearchIndicator);
