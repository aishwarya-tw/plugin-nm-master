import React, { Component } from 'react';

import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  Switch
} from '@material-ui/core';
import styles from './styles';

import ExpandingRow from './ExpandingRow';

class QueuesTable extends Component {
  filterDisabled(queues) {
    if (Object.keys(queues).length > 0) {
      return Object.assign(
        {},
        ...Object.keys(queues)
          .filter(
            queue =>
              queues[queue].config &&
              queues[queue].config.callbacksEnabled === true
          )
          .map(queue => {
            console.log('acskm queue after filter bruddo');
            return { [queue]: queues[queue] };
          })
      );
    }
  }

  render() {
    const {
      classes,
      queues = [],
      handleSave,
      handleDelete,
      showDisabled,
      handleShowDisabled
    } = this.props;

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.headerItem}>
          <Typography variant="h6">Queue Configuration</Typography>
        </Grid>

        <Grid item xs={12} className={classes.configItem}>
          <Grid container alignItems="center" justify="flex-end">
            <Typography
              variant="subtitle1"
              className={classes.label}
              align="right"
            >
              Show All
            </Typography>
            <Switch
              checked={showDisabled}
              onChange={handleShowDisabled}
              color="primary"
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell width="60%" className={classes.head}>
                  Name
                </TableCell>
                <TableCell width="32%" className={classes.head}>
                  Type
                </TableCell>
                <TableCell width="8%" className={classes.head} />
              </TableRow>
            </TableHead>

            <TableBody>
              {queues &&
                queues.length > 0 &&
                Object.keys(
                  showDisabled ? queues : this.filterDisabled(queues)
                ).map((queueSid, index) => {
                  return (
                    <ExpandingRow
                      key={`expanding-row-${index}`}
                      queue={queues[queueSid]}
                      handleSave={handleSave}
                      handleDelete={handleDelete}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(QueuesTable);
