import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  withStyles
} from '@material-ui/core';

import styles from './styles';

class SDASettings extends React.Component {
  render() {
    const { classes, sdaProviders, handleSdaChange } = this.props;
    return (
      <Grid className={classes.root}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.headerItem}>
            SDA Traffic Distribution
          </Typography>
        </Grid>

        {sdaProviders.map(sdaProvider => {
          return (
            <Grid
              container
              alignItems="center"
              className={classes.configRow}
              key={sdaProvider.name}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle1">{sdaProvider.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={sdaProvider.weight}
                  name={sdaProvider.name}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    )
                  }}
                  onChange={handleSdaChange}
                />
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(SDASettings);
