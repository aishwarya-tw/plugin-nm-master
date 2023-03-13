import React from 'react';
import GlobalConversationSearch from '../components/GlobalConversationSearch';
import ToolContainer from '../components/ToolContainer';
import BubbleAttachment from '../components/BubbleAttachment';
import CDTCompleteTaskBtn from '../components/CDTCompleteTaskBtn/';
import CloseTicketBtn from '../components/CloseTicketBtn';
import ChatInput from '../components/ChatInput/';
import EmailInput from '../components/EmailInput/';
import ComposeEmail from '../components/ComposeEmail/';
import SubjectLine from '../components/SubjectLine/';
import StartButton from '../components/StartButton';
import HeaderText from '../components/HeaderText';
import ChatHeaderLabel from '../components/ChatHeaderLabel';
import CapacityManager from '../components/CapacityManager';
import SideNavIconButton from '../components/GlobalConversationSearch/SideNavIconButton';
import EmailMessageBubble from '../components/EmailMessageBubble';
import BrowserRingerHeader from '../components/BrowserRingerHeader';
import BulkSkillManagerSideNavButton from '../components/BulkSkillManager/SideNavIcon';
import BulkSkillManager from '../components/BulkSkillManager';
import ParticipantActionsButtons from '../components/ExternalWarmTransfers/ParticipantActionsButtons';
import ParticipantName from '../components/ExternalWarmTransfers/ParticipantName';
import ParticipantStatus from '../components/ExternalWarmTransfers/ParticipantStatus';
import ParticipantStatusContainer from '../components/ExternalWarmTransfers/ParticipantStatusContainer';
import ConferenceButton from '../components/ExternalWarmTransfers/ConferenceButton';
import ConferenceDialog from '../components/ExternalWarmTransfers/ConferenceDialog';
import ConferenceMonitor from '../components/ExternalWarmTransfers/ConferenceMonitor';
import VoicemailViewer from '../components/VoicemailViewer';
import ViewWorkerSkills from '../components/ViewWorkerSkills';
import ViewWorkerCapacity from '../components/ViewWorkerCapacity';
import SettingsView from '../components/SettingsView';
import SettingsIconButton from '../components/SettingsView/SettingsIconButton';
import {
  cqsSort,
  cqsContent,
  auxContent,
  auxSort
} from '../components/CustomQueuesStats';
import { ColumnDefinition } from '@twilio/flex-ui';
import OriginLink from '../components/OriginLink';
import AgentProfilePageSideNavButton from '../components/AgentProfilePage/SideNavIcon';
import AgentProfilePage from '../components/AgentProfilePage';
import StoreTransferButton from '../components/StoreTransferButton';
import StoreTransferDialog from '../components/StoreTransferDialog';
import RealTimeAgentActivity from '../components/RealTimeAgentActivity';
import AvailableQueuesTab from '../components/AvailableQueuesTab';
import AuxHeaderIcon from '../assets/AuxHeaderIcon';
import { AgentAuxActivities as Aux, REDUX_NAMESPACE } from '../utils/constants';
import QueueFilters from '../components/QueueButtons';
import OpsManagerFilter from '../components/OpsManagerFilter';
import SelectableMessageListItem from '../components/SelectableMessageListItem';
// import ConfigurationSidebarButton from '../components/ConfigurationSidebarButton';
// import ConfigurationView from '../components/ConfigurationView';

import {
  TaskStatuses,
  ChannelTypes,
  ReservationEvents
} from '../utils/constants';

const chatInputRef = React.createRef();

function emailToCustomer(flex, manager) {
  //const name  = manager.workerClient.activity._worker.activity.name;
  flex.CRMContainer.Content.add(
    <ComposeEmail name="compose-email" key="compose-email" />
    //<EmailToCustomer name="email-to-customer" key="email-to-customer"/> // Not sure why we need both EmailToCustomer as well as ComposeEmail
  );
}

function toolContainer(flex) {
  flex.CRMContainer.Content.remove('placeholder');
  flex.CRMContainer.Content.replace(
    <ToolContainer key="tool-container" chatInputRef={chatInputRef} />,
    {
      if: props =>
        props.task &&
        [ReservationEvents.accepted, ReservationEvents.wrapping].includes(
          props.task.status
        )
    }
  );
}

function bubbleAttachment(flex) {
  flex.MessageBubble.Content.add(<BubbleAttachment key="bubble-attachment" />, {
    if: props =>
      !props.message.source.media && // do not render this component for platinum chat messages
      props.message.source.attributes.attachments &&
      props.message.source.attributes.attachments.length > 0
  });
}

function taskHeaders(flex, manager) {
  flex.TaskCanvasHeader.Content.remove('actions', {
    if: props => {
      const isTaskWrapping = props.task.taskStatus === TaskStatuses.wrapping;
      const isChat = props.task.attributes.channelType === ChannelTypes.chat;
      const isVoice = props.task.attributes.channelType === ChannelTypes.voice ||
        props.task.taskChannelUniqueName === ChannelTypes.voice;
      const isSms = props.task.attributes.channelType === ChannelTypes.sms;
      const isEmail = props.task.attributes.channelType === ChannelTypes.email;
      const isCdtRequired = props.task.attributes && props.task.attributes.cdtRequired;
      
      if (isChat) {
        return isTaskWrapping;
      } else if (isVoice) {
        return isTaskWrapping || isCdtRequired;
      } else if (isSms) {
        return isTaskWrapping && isCdtRequired;
      } else if (isEmail) {
        return true;
      }
      return false;
    }
  });

  // flex.TaskCanvasHeader.Content.remove('actions', {
  //   if: props =>
  //     props.task.attributes.channelType === ChannelTypes.voice ||
  //     props.task.taskChannelUniqueName === ChannelTypes.voice
  // });

  flex.TaskCanvasHeader.Content.add(
    <CDTCompleteTaskBtn key="cdt-complete-task-btn" />,
    {
      if: props => {
        //If: (task wrapping || (reservation wrapping && voice)) && (chat || voice || ((sms || email) && cdtRequired))
        //Note: for voice taskStatus differs from status when transferred
        const isTaskWrapping = props.task.taskStatus === TaskStatuses.wrapping;
        const isReservationWrapping = props.task.status === TaskStatuses.wrapping;
        const isChat = props.task.attributes.channelType === ChannelTypes.chat;
        const isVoice = props.task.attributes.channelType === ChannelTypes.voice ||
          props.task.taskChannelUniqueName === ChannelTypes.voice;
        const isSms = props.task.attributes.channelType === ChannelTypes.sms;
        const isEmail = props.task.attributes.channelType === ChannelTypes.email;
        const isCdtRequired = props.task.attributes && props.task.attributes.cdtRequired;

        if (isChat) {
          return isTaskWrapping;
        } else if (isVoice) {
          return isTaskWrapping || isReservationWrapping;
        } else if (isSms || isEmail) {
          return isTaskWrapping && isCdtRequired;
        }
        return false;
      }
    }
  );

  flex.TaskCanvasHeader.Content.add(<CloseTicketBtn key="close-ticket-btn" />, {
    if: props =>
      props.task.status === ReservationEvents.accepted &&
      (props.task.attributes.channelType === ChannelTypes.sms ||
        props.task.attributes.channelType === ChannelTypes.voice ||
        props.task.taskChannelUniqueName === ChannelTypes.voice ||
        props.task.attributes.channelType === ChannelTypes.email),
    sortOrder: 2,
    align: 'start'
  });

  flex.TaskCanvasHeader.Content.add(<ChatHeaderLabel key="brand-name" />, {
    if: props =>
      props.task.status === ReservationEvents.accepted &&
      (props.task.attributes.channelType === ChannelTypes.sms ||
        props.task.attributes.channelType === ChannelTypes.chat ||
        props.task.attributes.channelType === ChannelTypes.voice),
    sortOrder: 1,
    align: 'start'
  });

  flex.TaskCanvasHeader.Content.add(<OriginLink key="origin-link" />, {
    if: props =>
      props.task.status === ReservationEvents.accepted &&
      props.task.attributes.channelType === ChannelTypes.chat &&
      props.task.attributes.conversations.conversation_attribute_2 !==
        undefined,
    sortOrder: 3,
    align: 'end'
  });
}

function messageBubbles(flex) {
  flex.MessageBubble.Content.replace(
    <EmailMessageBubble key="custom-email-message-bubble" />,
    {
      if: props => {
        const { message } = props;

        if (message && Object.hasOwnProperty.call(message, 'source')) {
          const { source } = message;

          if (source && Object.hasOwnProperty.call(source, 'channel')) {
            const { channel } = source;
            const { attributes } = channel;
            const { channel_type } = attributes;

            return channel_type === ChannelTypes.email;
          }
        }
        return false;
      }
    }
  );

  flex.MessageListItem.Content.replace(
    <SelectableMessageListItem key="message-checkbox"/>,
    {
      if: props => {
        const { message } = props;
        const isWebChat = message.source.channel.friendlyName === 'Flex WebChat';
        const isStanleyChat = message.source.channel.friendlyName === 'Stanley App';
        return isWebChat || isStanleyChat;
      }
    }
  );
}

function messageInputs(flex, manager) {
  flex.MessageInput.Content.replace(
    <ChatInput key="chat-input" chatInputRef={chatInputRef} />,
    {
      if: props => {
        const { channelSid } = props;
        const { worker } = manager.store.getState().flex;
        const matchingTask = Array.from(worker.tasks.values()).find(
          task => task.attributes.channelSid === channelSid
        );

        if (matchingTask) {
          const { channelType } = matchingTask.attributes;
          const isSMS = channelType === ChannelTypes.sms;
          const isWebChat = channelType === ChannelTypes.chat;

          return isSMS || isWebChat;
        }

        return false;
      }
    }
  );

  flex.MessageInput.Content.replace(
    <EmailInput key="email-input" chatInputRef={chatInputRef} />,
    {
      if: props => {
        const { channelSid } = props;
        const { worker } = manager.store.getState().flex;
        const matchingTask = Array.from(worker.tasks.values()).find(
          task => task.attributes.channelSid === channelSid
        );

        if (matchingTask) {
          const { channelType } = matchingTask.attributes;
          const isEmail = channelType === ChannelTypes.email;

          return isEmail;
        }

        return false;
      }
    }
  );
}

function emailSubject(flex, manager) {
  flex.MessageListItem.Content.add(<SubjectLine key="subject-line" />, {
    if: props => {
      const { channelSid } = props;
      const { worker } = manager.store.getState().flex;
      const matchingTask = Array.from(worker.tasks.values()).find(
        task => task.attributes.channelSid === channelSid
      );

      if (matchingTask) {
        const { channelType } = matchingTask.attributes;
        const isEmail = channelType === ChannelTypes.email;

        return isEmail;
      }

      return false;
    },
    sortOrder: -100
  });
}

function taskListButtons(flex, manager) {
  // const { autoAcceptDisabled } = manager.serviceConfiguration.attributes.NMG;
  
  flex.TaskListButtons.Content.remove('accept');
  flex.TaskListButtons.Content.remove('reject', {
    if: props => {
      const { queues } = manager.store.getState()[REDUX_NAMESPACE].manualAcceptQueues;
      const currentQueue = props.task.queueName.replace(/\s/g, "").replace("(Voice)","");
      return (!(props.task.attributes.targetQueue &&
        (queues.includes(props.task.attributes.targetQueue)||(queues.includes(currentQueue)))))
    
    }
  });
  flex.TaskListButtons.Content.add(<StartButton key="start-btn" />, {
    if: props => props.task.status === TaskStatuses.pending
  });
}

function incomingCanvasButtons(flex) {
  flex.IncomingTaskCanvasActions.Content.remove('Accept');
  flex.IncomingTaskCanvasActions.Content.remove('Reject');
  flex.IncomingTaskCanvasActions.Content.add(<StartButton key="start-btn" />);
}

function headerLogo(flex) {
  flex.MainHeader.Content.remove('logo');
  flex.MainHeader.Content.add(<HeaderText key="header-text" />);
}

function supervisorTaskInfoPanel(flex, manager) {
  const { attributes } = manager.workerClient;
  const { roles } = attributes;

  if (roles.includes('admin')) {
    flex.WorkerCanvas.Content.add(<CapacityManager key="capacity-manager" />, {
      sortOrder: 100
    });
  } else if (roles.includes('supervisor')) {
    flex.WorkerCanvas.Content.remove('skills');
    flex.WorkerCanvas.Content.add(<ViewWorkerSkills key="view-only-skills" />, {
      sortOrder: 100
    });
    flex.WorkerCanvas.Content.add(
      <ViewWorkerCapacity key="view-only-capacity" />,
      {
        sortOrder: 110
      }
    );
  }
}

function browserRinger(flex, manager) {
  if (manager.voiceClient.audio.availableOutputDevices.size > 0) {
    flex.MainHeader.Content.add(
      <BrowserRingerHeader key="browser-ringer-header" />,
      { sortOrder: -1, align: 'end' }
    );
  }
}

function SideNavIcon(flex, manager) {
  const { roles } = manager.workerClient.attributes;

  if (roles.includes('supervisor') || roles.includes('admin')) {
    flex.SideNav.Content.add(<SideNavIconButton key="side-nav-icon" />);
    flex.ViewCollection.Content.add(
      <flex.View name="global-search" key="global-search">
        <GlobalConversationSearch />
      </flex.View>
    );
  }
}

function bulkSkillUpdates(flex, manager) {
  const { roles } = manager.workerClient.attributes;

  if (roles.includes('admin')) {
    flex.ViewCollection.Content.add(
      <flex.View name="bulk-skill-manager" key="bulk-skill-manager">
        <BulkSkillManager key="bulk-skill-manager-parent-component" />
      </flex.View>
    );
    flex.SideNav.Content.add(
      <BulkSkillManagerSideNavButton key="bulk-skill-manager-side-nave-icon" />
    );
  }
}

function AgentProfileViewer(flex) {
  flex.ViewCollection.Content.add(
    <flex.View name="agent-profile-page" key="agent-profile-page">
      <AgentProfilePage key="agent-profile-page-parent-component" />
    </flex.View>
  );
  flex.SideNav.Content.add(
    <AgentProfilePageSideNavButton key="agent-profile-page-side-nav-icon" />
  );
}

function externalWarmTransfers(flex, manager) {
  flex.CallCanvasActions.Content.add(<ConferenceButton key="conference" />, {
    sortOrder: 2
  });

  flex.CallCanvas.Content.add(<ConferenceDialog key="conference-modal" />, {
    sortOrder: 100
  });

  // This component doesn't render anything to the UI, it just monitors
  // conference changes and takes action as necessary
  flex.CallCanvas.Content.add(<ConferenceMonitor key="conference-monitor" />, {
    sortOrder: 999
  });

  const isUnknownParticipant = props =>
    props.participant.participantType === 'unknown';

  // This section is for the full width ParticipantCanvas
  flex.ParticipantCanvas.Content.remove('actions');
  flex.ParticipantCanvas.Content.add(
    <ParticipantActionsButtons key="custom-actions" />,
    { sortOrder: 10 }
  );
  flex.ParticipantCanvas.Content.remove('name', { if: isUnknownParticipant });
  flex.ParticipantCanvas.Content.add(<ParticipantName key="custom-name" />, {
    sortOrder: 1,
    if: isUnknownParticipant
  });
  flex.ParticipantCanvas.Content.remove('status');
  flex.ParticipantCanvas.Content.add(
    <ParticipantStatus key="custom-status" />,
    { sortOrder: 2 }
  );

  // This section is for the narrow width ParticipantCanvas, which changes to List Mode,
  // introduced in Flex 1.11.0. ListItem did not exist on ParticipantCanvas before 1.11.0.
  if (flex.ParticipantCanvas.ListItem) {
    flex.ParticipantCanvas.ListItem.Content.remove('statusContainer');
    flex.ParticipantCanvas.ListItem.Content.add(
      <ParticipantStatusContainer key="custom-statusContainer" />,
      { sortOrder: 1 }
    );
    flex.ParticipantCanvas.ListItem.Content.remove('actions');
    flex.ParticipantCanvas.ListItem.Content.add(
      <ParticipantActionsButtons key="custom-actions" />,
      { sortOrder: 10 }
    );
  }
}

function voicemailViewer(flex, manager) {
  flex.ViewCollection.Content.add(
    <flex.View name="voicemail-viewer" key="voicemail-viewer">
      <VoicemailViewer key="voicemail-viewer-component" />
    </flex.View>
  );
}

function settingsViewer(flex, manager) {
  const { roles } = manager.workerClient.attributes;

  if (roles.includes('admin')) {
    flex.SideNav.Content.add(<SettingsIconButton key="settings-nav-icon" />);
    flex.ViewCollection.Content.add(
      <flex.View name="settings-viewer" key="settings-viewer">
        <SettingsView />
      </flex.View>
    );
  }
}

function QueueStatsTable(flex, manager) {
  // flex.QueuesStats.QueuesDataTable.Content.remove('active-tasks');
  //flex.QueuesStats.QueuesDataTable.Content.remove('waiting-tasks');
  //flex.QueuesStats.QueuesDataTable.Content.remove('longest-wait-time');

  ['staff', 'avail'].forEach(q => {
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
        key={`custom-stats-table-${q}`}
        header={q.toUpperCase()}
        content={queue => cqsContent({ type: q, queue: queue })}
        sortingFn={(a, b) => cqsSort({ column: q, a: a, b: b })}
        sortDirection="asc"
      />,
      { sortOrder: 0 }
    );
  });

  Aux.forEach(activity => {
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
        key={`custom-stats-col-${activity}`}
        header={<AuxHeaderIcon activity={activity} />}
        content={queue => auxContent(queue, activity)}
        sortingFn={(a, b) => auxSort({ a, b }, activity)}
      />,
      { sortOrder: 0 }
    );
  });

  flex.QueuesStatsView.Content.add(
    <QueueFilters key="queue-filters" />,
    { sortOrder: 0 }
  );
}

function clickToCallStores(flex, manager) {
  flex.CallCanvasActions.Content.add(
    <StoreTransferButton key="store-transfer" />,
    {
      sortOrder: 2
    }
  );

  flex.CallCanvas.Content.add(
    <StoreTransferDialog key="store-transfer-modal" />,
    {
      sortOrder: 100
    }
  );
}

function realTimeAgentActivity(flex, manager) {
  const { roles } = manager.workerClient.attributes;

  // only retrieve data if supervisor or admin
  if (roles.includes('supervisor') || roles.includes('admin')) {
    RealTimeAgentActivity(flex, manager);
  }
}

function outboundDialer(flex) {
  flex.OutboundDialerPanel.Content.remove('queue-select');
  flex.OutboundDialerPanel.Content.remove('queue-select-caption');
}

function availableQueuesTab(flex) {
  flex.WorkerDirectory.Tabs.Content.remove('queues');

  flex.WorkerDirectory.Tabs.Content.add(
    <flex.Tab key="available-queues-tab" label="Queues">
      <AvailableQueuesTab
        invokeTransfer={(params) => {
          flex.Actions.invokeAction('TransferTask', params);
          flex.Actions.invokeAction('HideDirectory');
        }}
      />
    </flex.Tab>,
    { sortOrder: -1 }
  );
}

function opsManagerFilter(flex, manager) {
  const { full_name } = manager.workerClient.attributes;

  flex.Supervisor.TeamFiltersPanel.Content.add(
    <OpsManagerFilter key="ops-manager-filter" userName={full_name} />,
    { sortOrder: 0 }
  );

  //Since a true hierarchical view cannot be made, we can at least add the worker's team manager if desired.
  //Unfortunately the table is not sortable, so workers won't be grouped by team manager.
  flex.WorkersDataTable.Content.add(
    <ColumnDefinition
      key="team-manager"
      header="team manager"
      content={item => item.worker.attributes.teamManager}
      style={{ width: '150px' }}
    />,
    { sortOrder: 0 }
  );
}

// function callbacks(flex, manager) {
//   if (manager.user.roles.includes('admin')) {
//     flex.SideNav.Content.add(
//       <ConfigurationSidebarButton key="callbacks-config-button" />
//     );

//     flex.ViewCollection.Content.add(
//       <flex.View key="callbacks-config-view" name="callbacks-config">
//         <ConfigurationView />
//       </flex.View>
//     );
//   }
// }

export default (flex, manager) => {
  toolContainer(flex);
  emailToCustomer(flex, manager);
  bubbleAttachment(flex);
  taskHeaders(flex, manager);
  incomingCanvasButtons(flex);
  messageInputs(flex, manager);
  emailSubject(flex, manager);
  taskListButtons(flex, manager);
  headerLogo(flex);
  supervisorTaskInfoPanel(flex, manager);
  SideNavIcon(flex, manager);
  messageBubbles(flex, manager);
  browserRinger(flex, manager);
  bulkSkillUpdates(flex, manager);
  externalWarmTransfers(flex, manager);
  QueueStatsTable(flex, manager);
  voicemailViewer(flex, manager);
  settingsViewer(flex, manager);
  AgentProfileViewer(flex);
  clickToCallStores(flex, manager);
  opsManagerFilter(flex, manager);
  realTimeAgentActivity(flex, manager);
  outboundDialer(flex);
  availableQueuesTab(flex);
  // callbacks(flex, manager);
};
