import React, { Component } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { STATUS_DATE_FORMAT } from '../../utils/constants';
import { renderValue, renderDate, renderAddress } from '../../utils/helpers';

class Status extends Component {
  render() {
    const {
      estimatedDelivery,
      from,
      service,
      status,
      to,
      classes
    } = this.props;

    return (
      <div>
        <Grid container item xs={12} className={classes.statusContainer}>
          <Grid container direction="column" alignItems="center" item xs={12}>
            <Typography className={classes.statusDescription} align="center">
              {renderValue(status.description)}
            </Typography>
            <Typography className={classes.statusAddr} align="center">
              {renderAddress(status)}
            </Typography>
            <Typography className={classes.statusDate} align="center">
              {renderDate(status.timestamp, STATUS_DATE_FORMAT)}
            </Typography>
          </Grid>

          <Grid
            container
            direction="column"
            alignItems="center"
            item
            xs={6}
            className={classes.statusOtherItem}
          >
            <Typography className={classes.statusOtherLabel} align="center">
              Estimated Delivery
            </Typography>
            <Typography className={classes.statusOtherVal} align="center">
              {renderDate(estimatedDelivery, STATUS_DATE_FORMAT)}
            </Typography>
          </Grid>

          <Grid
            container
            direction="column"
            alignItems="center"
            item
            xs={6}
            className={classes.statusOtherItem}
          >
            <Typography className={classes.statusOtherLabel} align="center">
              Service Type
            </Typography>
            <Typography className={classes.statusOtherVal} align="center">
              {renderValue(service)}
            </Typography>
          </Grid>

          <Grid
            container
            direction="column"
            alignItems="center"
            item
            xs={6}
            className={classes.statusOtherItem}
          >
            <Typography className={classes.statusOtherLabel} align="center">
              Origin
            </Typography>
            <Typography className={classes.statusOtherVal} align="center">
              {renderAddress(from)}
            </Typography>
          </Grid>

          <Grid
            container
            direction="column"
            alignItems="center"
            item
            xs={6}
            className={classes.statusOtherItem}
          >
            <Typography className={classes.statusOtherLabel} align="center">
              Destination
            </Typography>
            <Typography className={classes.statusOtherVal} align="center">
              {renderAddress(to)}
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Status;
