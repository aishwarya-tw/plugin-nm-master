import React, { Component } from 'react';
import clsx from 'clsx';

import {
  Collapse,
  TableCell,
  TableRow,
  IconButton,
  withStyles
} from '@material-ui/core';
import { KeyboardArrowDown as DownIcon } from '@material-ui/icons';

import styles from './styles';
import QueueConfiguration from '../../QueueConfiguration';

class ExpandingRow extends Component {
  state = {
    open: false
  };

  toggleExpansion = () => {
    this.setState(({ open }) => ({ open: !open }));
  };

  render() {
    const { open } = this.state;
    const { classes, queue, handleSave, handleDelete } = this.props;

    const configs = {
      simple: 'Simple',
      ewt: 'EWT',
      'queue-depth': 'Queue Depth'
    };
    const queueType =
      queue.config && queue.config.type ? configs[queue.config.type] : '—';

    return (
      <>
        <TableRow key={queue.sid}>
          <TableCell>{queue.name}</TableCell>
          <TableCell>{queueType}</TableCell>
          <TableCell className={classes.buttonCell}>
            <IconButton
              onClick={this.toggleExpansion}
              className={classes.button}
            >
              <DownIcon
                className={clsx(classes.icon, open && classes.rotateIcon)}
              />
            </IconButton>
          </TableCell>
        </TableRow>

        <TableRow className={classes.expandRow}>
          <TableCell padding="none" colSpan={3} className={classes.expandCell}>
            <Collapse
              in={open}
              classes={{
                entered: classes.collapseEntered,
                wrapperInner: classes.collapseWrapperInner
              }}
            >
              <QueueConfiguration
                configuration={queue.config}
                handleSave={newConfiguration => {
                  handleSave(newConfiguration, queue.sid);
                }}
                handleDelete={() => handleDelete(queue.sid)}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

export default withStyles(styles)(ExpandingRow);
