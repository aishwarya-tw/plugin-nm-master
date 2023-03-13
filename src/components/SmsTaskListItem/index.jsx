import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core';
import styles from './styles';
import clsx from 'clsx';

import * as Icons from '@material-ui/icons';
import {
  REDUX_NAMESPACE,
  TASK_INDICATOR_ICONS,
  TASK_INDICATOR_TYPES
} from '../../utils/constants';

class SmsTaskListItem extends Component {
  render() {
    const { taskStatusIndicators, classes } = this.props;

    if (!!taskStatusIndicators) {
      const { indicatorType } = taskStatusIndicators;
      const Icon = Icons[TASK_INDICATOR_ICONS[indicatorType]];
      const indicatorTypeClass =
        indicatorType === TASK_INDICATOR_TYPES.UnresponsiveAgent
          ? classes.unresponsiveAgent
          : classes.inactiveCustomer;

      return (
        <div
          className={clsx(classes.container, classes.taskIndicator, indicatorTypeClass)}
        >
          <Flex.TaskListBaseItem {...this.props} />
          <Icon className={classes.indicatorIcon} />
        </div>
      );
    }
    return <Flex.TaskListBaseItem {...this.props} />;
  }
}

const mapStateToProps = (state, ownProps) => ({
  taskStatusIndicators:
    state[REDUX_NAMESPACE].taskStatusIndicators[ownProps.task.taskSid]
});

export default withStyles(styles)(connect(mapStateToProps)(SmsTaskListItem));
