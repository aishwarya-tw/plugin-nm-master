import React, { Component } from 'react';

import { Grid, Typography, withStyles } from '@material-ui/core';
import styles from './styles';

class NoResults extends Component {
  render() {
    const { classes } = this.props;
    return (
      <>
        <Grid container justify="center" item xs={12}>
          <Typography
            variant="h4"
            className={classes.errorMessage}
            align="center"
          >
            No Results
          </Typography>
        </Grid>
      </>
    );
  }
}

export default withStyles(styles)(NoResults);
