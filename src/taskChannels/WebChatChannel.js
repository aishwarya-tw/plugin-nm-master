import React from 'react';
import { DefaultTaskChannels } from '@twilio/flex-ui';
import { ChannelTypes } from '../utils/constants';
import { CHANNEL_ICON_COLORS } from '../utils/constants';
import WebchatTaskListItem from '../components/WebchatTaskListItem/';

// register a custom channel for webchat 
const channel = DefaultTaskChannels.createChatTaskChannel(
  'web',
  task => task.attributes.channelType === ChannelTypes.chat
);

channel.colors.main = (ITask) => {
 //there are two attributes whuch tells  the satus 1. ITask.status 2. ITask.taskStatus
  if(ITask.attributes.transfer&&(ITask.status === "pending"  || ITask.status === "accepted" || ITask.status === "assigned" || ITask.status === "reserved")) {
        return CHANNEL_ICON_COLORS.chatTransfer;//change the color if webchat task is a transfer
  }
  else if (ITask.status === "pending"  || ITask.status === "accepted" || ITask.status === "assigned" || ITask.status === "reserved"){
  return CHANNEL_ICON_COLORS.chat;
  }
 return "#a0a8bd"; // for channel.colors.main.Canceled ,Completed ,Wrapping  for webchat
};

channel.replacedComponents = [
  {
    target: 'TaskListItem',
    component: <WebchatTaskListItem key="webchat-task-list-item" />
  }
];

export default channel;