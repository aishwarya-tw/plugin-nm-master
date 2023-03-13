import React, { Component } from 'react';
import moment from 'moment';

import {
  Grid,
  Typography,
  List,
  ListItem,
  ListSubheader
} from '@material-ui/core';

import { EVENTS_DATE_FORMAT, EVENTS_TIME_FORMAT } from '../../utils/constants';
import { renderAddress } from '../../utils/helpers';

class Events extends Component {
  renderRecords = () => {
    const { events, classes } = this.props;

    const sortedEvents = events.sort((a, b) => {
      const aDate = moment.utc(a.timestamp);
      const bDate = moment.utc(b.timestamp);

      if (aDate.isSame(bDate)) {
        return 0;
      }

      return aDate.isBefore(bDate) ? 1 : -1;
    });

    const datedEvents = sortedEvents.reduce((acc, event) => {
      const date = moment.utc(event.timestamp).format(EVENTS_DATE_FORMAT);
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(event);
      return acc;
    }, {});

    const listItems = Object.keys(datedEvents).map(date => {
      const dateEvents = datedEvents[date];
      const dateItems = dateEvents.map(record => {
        const recordTime = moment
          .utc(record.timestamp)
          .format(EVENTS_TIME_FORMAT);

        return (
          <ListItem>
            <Grid container>
              <Grid item xs={4}>
                {recordTime}
              </Grid>

              <Grid item xs={4}>
                {record.description}
              </Grid>

              <Grid item xs={4}>
                {renderAddress(record)}
              </Grid>
            </Grid>
          </ListItem>
        );
      });

      return (
        <>
          <ListSubheader className={classes.eventSubheader}>
            {date}
          </ListSubheader>
          {dateItems}
        </>
      );
    });

    return <List className={classes.eventsList}>{listItems}</List>;
  };

  render() {
    const { events } = this.props;

    return (
      <Grid container justify="center" item xs={12}>
        {events && this.renderRecords()}
        {!events && (
          <Typography variant="body1" align="center">
            No history found.
          </Typography>
        )}
      </Grid>
    );
  }
}

export default Events;
