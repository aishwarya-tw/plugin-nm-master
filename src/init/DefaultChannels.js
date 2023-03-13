import React from 'react';
import SmsTaskListItem from '../components/SmsTaskListItem';
import WebchatTaskListItem from '../components/WebchatTaskListItem/';

function chatOverrides(flex) {
  flex.DefaultTaskChannels.Chat.replacedComponents = [
    {
      target: 'TaskListItem',
      component: <WebchatTaskListItem key="webchat-task-list-item" />
    }
  ];
}

function smsOverrides(flex) {
  flex.DefaultTaskChannels.ChatSms.replacedComponents = [
    {
      target: 'TaskListItem',
      component: <SmsTaskListItem key="sms-task-list-item" />
    }
  ];
}

export default (flex, manager) => {
  smsOverrides(flex);
  chatOverrides(flex);
};
