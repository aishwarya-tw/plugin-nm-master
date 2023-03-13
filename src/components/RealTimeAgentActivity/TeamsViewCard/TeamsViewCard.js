import React, { Component } from 'react';

class TeamsViewCard extends Component {
  render() {
    const { report = {}, content = {}, type } = this.props;
    const { worker = {} } = content;
    const { sid } = worker; // worker Sid
    const data = report[sid];
    const metric = type[0];
    const channel = type[1];

    if (!data || !metric) {
      return <div>{'-'}</div>;
    }

    switch (metric) {
      case 'tasks':
        const {
          tasks_handled = { N: '-' },
          tasks_timeout = { N: '-' },
          tasks_declined = { N: '-' }
        } = data;
        let value = 0;
        if (channel === 'Handled') {
          value = tasks_handled.N;
        } else if (channel === 'Timeout') {
          value = tasks_timeout.N;
        } else if (channel === 'Declined') {
          value = tasks_declined.N;
        }
        return <div>{value}</div>;
      case 'capacity':
        const {
          task_capacity_voice = { N: '-' },
          task_capacity_chat = { N: '-' },
          task_capacity_email = { N: '-' },
          task_capacity_sms = { N: '-' }
        } = data;
        return (
          <div>
            {task_capacity_voice.N} / {task_capacity_chat.N} /{' '}
            {task_capacity_email.N} / {task_capacity_sms.N}
          </div>
        );
      default:
        return <div>{'-'}</div>;
    }
  }
}

export default TeamsViewCard;
