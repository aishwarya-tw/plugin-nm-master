import React from 'react';
import { DefaultTaskChannels } from '@twilio/flex-ui';

import EmailIcon from '@material-ui/icons/EmailOutlined';

import EmailTaskListItem from '../components/EmailTaskListItem/';
import { ChannelTypes } from '../utils/constants';
import { EMAIL_TAB_HEADER , CHANNEL_ICON_COLORS } from '../utils/constants';

// register a custom channel for email 
const channel = DefaultTaskChannels.createChatTaskChannel(
  'email',
  task => task.attributes.channelType === ChannelTypes.email
);

channel.icons.list = <EmailIcon />;
channel.icons.main = <EmailIcon />;
channel.icons.active = <EmailIcon />;
channel.colors.main = (ITask) => {
 //there are two attributes whuch tells the satus 1. ITask.status 2. ITask.taskStatus
  if(ITask.attributes.conversations.direction === "Outbound" &&(ITask.status === "pending"  || ITask.status === "accepted" || ITask.status === "assigned" || ITask.status === "reserved")) {
        return CHANNEL_ICON_COLORS.emailOutbound;//change the color if email task direction is outbound
  }
  else if (ITask.attributes.conversations.direction === "Inbound" &&(ITask.status === "pending"  || ITask.status === "accepted" || ITask.status === "assigned" || ITask.status === "reserved")){
  return CHANNEL_ICON_COLORS.emailInbound;
  }
 return "#a0a8bd"; // for channel.colors.main.Canceled ,Completed ,Wrapping 
};

channel.replacedComponents = [
  {
    component: <EmailTaskListItem key="email-task-list-item" />,
    target: 'TaskListItem'
  }
];

channel.templates.TaskCanvasTabs.contentTabHeader = EMAIL_TAB_HEADER;

export default channel;
