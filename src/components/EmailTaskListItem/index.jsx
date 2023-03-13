import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import moment from 'moment';
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

class EmailTaskListItem extends Component {
  state = {
    age: 0,
    intervalId: null
  };

  componentDidMount = () => {
    this.updateAge();
    const intervalId = setInterval(this.updateAge, 1000);
    this.setState({ intervalId });
  };

  componentWillUnmount = () => {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
      this.setState({ intervalId: undefined });
    }
  };

  updateAge = () => {
    const now = moment.utc().valueOf();
    const updated = moment
      .utc(this.props.task._reservation.dateUpdated)
      .valueOf();

    this.setState({ age: (now - updated) / 1000 });
  };

  render() {
    const { age } = this.state;
    const { task, chatChannel, taskStatusIndicators, classes} = this.props;
    const { name, emailAddr , outbound} = task.attributes;
    // find subject of latest message
    let subject = '';
    if (chatChannel && chatChannel.messages.length > 0) {
      const message = chatChannel.messages[chatChannel.messages.length - 1];
      subject = message.source.attributes.subject || '(no subject)';
    }
    // strings used for task list base item
    const firstLine = name ? name : emailAddr;
    const formattedAge = moment
      .utc(age * 1000)
      .format(age > 3600 ? 'HH:mm:ss' : 'mm:ss');
      let secondLine = '';
      if(outbound && outbound === 'true') {
        secondLine =
        task.status === 'pending'
          ? 'Compose email for Customer'
          : `${formattedAge} | : ${subject}`;
      }
      else {
         secondLine =
          task.status === 'pending'
            ? 'Incoming email request'
            : `${formattedAge} | : ${subject}`;
      }
    if (!!taskStatusIndicators) {
      const { indicatorType } = taskStatusIndicators;
      const Icon = Icons[TASK_INDICATOR_ICONS[indicatorType]];
      let indicatorTypeClass = classes.unresponsiveAgent;
      if (indicatorType === TASK_INDICATOR_TYPES.InactiveCustomer) {
        indicatorTypeClass = classes.inactiveCustomer;
      } else if (indicatorType === TASK_INDICATOR_TYPES.Postponed) {
        indicatorTypeClass = classes.postponedTask;
      }

      return (
        <div
         className={clsx(
            classes.container,
            classes.taskIndicator,
            indicatorTypeClass
          )}
        >
          <Flex.TaskListBaseItem
            firstLine={firstLine}
            secondLine={secondLine}
            {...this.props}
          />
         
          <Icon className={classes.indicatorIcon} />
        </div>
      );
    }

    return (
      <Flex.TaskListBaseItem
        firstLine={firstLine}
        secondLine={secondLine}
        {...this.props}
       
      />

    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  taskStatusIndicators:
    state[REDUX_NAMESPACE].taskStatusIndicators[ownProps.task.taskSid]
});

export default withStyles(styles)(connect(mapStateToProps)(EmailTaskListItem));