import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  withStyles
} from '@material-ui/core';

import styles from './styles';

class BPOSettings extends React.Component {
  render() {
    const { classes, bpoProviders, handleBpoChange } = this.props;
    return (
      <Grid className={classes.root}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.headerItem}>
            BPO Traffic Distribution
          </Typography>
        </Grid>

        {bpoProviders.map(bpoProvider => {
          return (
            <Grid
              container
              alignItems="center"
              className={classes.configRow}
              key={bpoProvider.name}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle1">{bpoProvider.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={bpoProvider.weight}
                  name={bpoProvider.name}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    )
                  }}
                  onChange={handleBpoChange}
                />
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(BPOSettings);
