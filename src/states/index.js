import { combineReducers } from 'redux';
import ToolsReducer from './ToolsReducer';
import EmailReducer from './EmailReducer';
import ChatInputReducer from './ChatInputReducer';
import TaskStatusIndicatorReducer from './TaskStatusIndicatorReducer';
import CDTRecordsReducer from './CDTRecordsReducer';
import ResponseLibraryReducer from './ResponseLibraryReducer';
import AgentConnectivityReducer from './AgentConnectivityReducer';
import ConversationTimeoutReducer from './ConversationTimeoutReducer';
import CallbacksReducer from './CallbacksReducer';
import SkillManagerReducer from './SkillManagerReducer';
import RealTimeAgentActivityReducer from './RealTimeAgentActivityReducer.js';
import ManualAcceptQueuesReducer from './ManualAcceptQueuesReducer';
import AvailableQueuesReducer from './AvailableQueuesReducer';
import QueuesStatsFilterReducer from './QueuesStatsFilterReducer';
import PersonalNumberReducer from './PersonalNumberReducer';
import ChatTransferReducer from './ChatTransferReducer';
import CmdReducer from './CmdReducer';

export default combineReducers({
  // define custom reducers here
  // custom: CustomReducer
  tools: ToolsReducer,
  chatInput: ChatInputReducer,
  emails: EmailReducer,
  taskStatusIndicators: TaskStatusIndicatorReducer,
  cdtRecords: CDTRecordsReducer,
  responseLibrary: ResponseLibraryReducer,
  agentConnectivity: AgentConnectivityReducer,
  conversationTimeouts: ConversationTimeoutReducer,
  callbacks: CallbacksReducer,
  skillManager: SkillManagerReducer,
  realTimeAgentActivity: RealTimeAgentActivityReducer,
  manualAcceptQueues: ManualAcceptQueuesReducer,
  availableQueues: AvailableQueuesReducer,
  queuesStatsFilter: QueuesStatsFilterReducer,
  personalNumber: PersonalNumberReducer,
  chatTransfer: ChatTransferReducer,
  cmdProfile: CmdReducer,
});
