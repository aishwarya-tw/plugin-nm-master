export const API_DEFAULT_TIMEOUT = 15000;

export const PLUGIN_NAME = 'NMMasterPlugin';
export const REDUX_NAMESPACE = 'neimanMarcus';

export const CONVERSATION_DATE_FORMAT = 'MMM DD, YYYY hh:mm A';
export const EVENTS_DATE_FORMAT = 'MMM, YYYY';
export const EVENTS_TIME_FORMAT = 'hh:mm A';
export const STATUS_DATE_FORMAT = 'dddd DD/MM/YYYY [at] hh:mm A';

export const EMAIL_TAB_HEADER = 'CONVERSATION';

export const UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS =
  'UpdatedTrafficDistributionSuccess';
export const UPDATED_TRAFFIC_DISTRIBUTION_ERROR =
  'UpdatedTrafficDistributionError';
export const GET_TRAFFIC_DISTRIBUTION_ERROR = 'GetTrafficDistributionError';
export const END_CHAT_MESSAGE_FOR_AGENT = 'Customer closed the chat';

export const TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID =
  'TrafficDistributionWeightsNotValid';

export const POSTPONE_TASK_LIMIT_NOTIFICATION = 'PostponeTaskLimitNotification';
export const POSTPONE_WORKER_LIMIT_NOTIFICATION =
  'PostponeWorkerLimitNotification';
export const CDT_INCOMPLETE_NOTIFICATION = 'CDTIncompleteNotification';
export const BACKEND_ERROR_NOTIFICATION = 'BackendErrorNotification';
export const BACKEND_WARNING_NOTIFICATION = 'BackendWarningNotification';
export const GENERAL_ERROR_NOTIFICATION = 'GeneralErrorNotification';
export const RESPONSE_LIBRARY_SAVED_NOTIFICATION =
  'ResponseLibrarySavedNotification';
export const RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION =
  'ResponseLibrarySaveFailedNotification';
export const BROWSER_RINGER_NO_DEVICE_NOTIFICATION =
  'BrowserRingerNoDeviceNotification';
export const CHAT_TRANSFER_ERROR_NOTIFICATION =
  'ChatTransferErrorNotification';
export const INITIAL_TOOL = '/responses';
export const TOOLS = [
  {
    path: '/tools',
    component: 'ToolsMenu',
    hidden: true,
    isMenu: true
  },
  {
    label: 'Response Library',
    path: '/responses',
    component: 'ResponseLibrary',
    icon: 'ResponseIcon'
  },
  {
    label: 'Customer History',
    path: '/history',
    component: 'CustomerHistory',
    icon: 'HistoryIcon'
  },
  {
    label: 'Policies Portal',
    path: '/policies',
    component: 'PoliciesPortal',
    icon: 'PoliciesIcon'
  },
  {
    label: 'Fedex Tracking',
    path: '/fedex',
    component: 'FedexTracking',
    icon: 'FedexIcon'
  },
  {
    label: 'USPS Tracking',
    path: '/usps',
    component: 'USPSTracking',
    icon: 'USPSIcon'
  },
  {
    label: 'Contact Reason',
    path: '/disposition',
    icon: 'StellaIcon',
    component: 'DispositionSurvey'
  },
  {
    label: 'Email To Customer',
    path: '/emailtocustomer',
    component: 'EmailToCustomer',
    icon: 'EmailToCustomerIcon'
  },
  //{
    //label: 'Coupon Lookup',
    //path: '/CouponLookup',
    //component: 'CouponLookup',
   // icon: 'couponIcon'
  //},
  {
    path: '/chat-transfer',
    component: 'TransferForm',
    hidden: true,
  },
  {
    path: '/transfer-details',
    component: 'ReadOnlyTransferForm',
    hidden: true,
  },
  
];

export const TASK_INDICATOR_TYPES = {
  UnresponsiveAgent: 'UnresponsiveAgent',
  InactiveCustomer: 'InactiveCustomer',
  Postponed: 'Postponed'
};

export const TASK_INDICATOR_ICONS = {
  UnresponsiveAgent: 'Error',
  InactiveCustomer: 'Info',
  Postponed: 'Snooze'
};

export const PLATINUM_CHAT_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

export const IMAGE_EXTENSIONS = [
  'apng',
  'bmp',
  'gif',
  'ico',
  'cur',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp'
];

export const MAX_ATTACHMENTS_VISIBLE = 2;

export const DATA_UNAVAILABLE_TEXT = 'N/A';

export const EMOJI_LIST = [
  '🙂',
  '😃',
  '😁',
  '😋',
  '😍',
  '👍',
  '😲',
  '🙁',
  '😞',
  '😥'
];

export const AgentAuxActivities = [
    'Unavailable',
    'Break', 
    'Lunch', 
    'Customer Follow Up', 
    'Training-Meeting', 
    // 'OnOutboundEmailActivity '
  ];

export const TaskStatuses = {
  assigned: 'assigned',
  completed: 'completed',
  pending: 'pending',
  wrapping: 'wrapping'
};

export const ReservationEvents = {
  accepted: 'accepted',
  rejected: 'rejected',
  timeout: 'timeout',
  canceled: 'canceled',
  rescinded: 'rescinded',
  completed: 'completed',
  wrapping: 'wrapping'
};

export const TaskChannels = {
  voice: 'voice',
  sms: 'sms',
  chat: 'chat',
  email: 'email',
  callback: 'voice-callbacks'
};

export const ChannelTypes = {
  sms: 'sms',
  chat: 'web',
  email: 'email',
  voice: 'voice',
  callback: 'voice-callbacks'
};

export const ConversationState = {
  MissingCustomerMessage: 'MissingCustomerMessage',
  Postponed: 'Postponed',
  WaitingForAgent: 'WaitingForAgent',
  WaitingForCustomer: 'WaitingForCustomer'
};

export const ConversationStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  Reassigned: 'Reassigned'
};

export const Brand = {
  None: 'None',
  NeimanMarcus: 'Neiman Marcus',
  BergdorfGoodman: 'Bergdorf Goodman',
  Horchow: 'Horchow',
  LastCall: 'Last Call'
};

export const Channel = {
  All: 'All',
  SMS: 'SMS',
  WEBCHAT: 'WEBCHAT',
  EMAIL: 'EMAIL'
};

export const BPOProviders = [
  "Alorica GDL",
  "Alorica Honduras",
  "Arise",
  "Internal",
  "Telus",
  "Qualfon",
  "CCI"
];

export const Channels = [
  "Chat",
  "Email",
  "SMS",
  "Voice",
];

export const DateRange = {
  None: 'None',
  Custom: 'Custom',
  LastWeek: 'Last Week',
  LastMonth: 'Last Month',
  LastYear: 'Last Year'
};

export const ButtonVariants = {
  blue: {
    color: '#fff',
    backgroundColor: '#1976D2',
    hoverBackgroundColor: '#155EA8'
  },
  grey: {
    color: '#fff',
    backgroundColor: '#999999',
    hoverBackgroundColor: '#777777'
  },
  red: {
    color: '#fff',
    backgroundColor: '#D32F2F',
    hoverBackgroundColor: '#A92626'
  },
  transparent: {
    color: '#1976D2',
    backgroundColor: 'transparent',
    hoverBackgroundColor: '#ccc'
  },
  green: {
    color: '#fff',
    backgroundColor: '#04874A',
    hoverBackgroundColor: '#035c32'
  }
};

export const IconVariants = {
  grey: '#B0B9BE',
  blue: '#1976D2',
  white: '#fff',
  red: '#C0192D'
};

export const InputVariants = {
  grey: '#EDEDED',
  white: '#fff'
};

export const CHANNEL_ICON_COLORS = {
  sms: '#D81A60',
  chat: '#047E9F',
  chatTransfer: '#D81A60',
  email: '#1976D2',
  emailOutbound: '#D81A60',
  emailInbound: '#057d9e',
  voice: '#1976d2',
  voiceOutbound: '#D81A60',
  voiceInbound: '#057d9e',
};

export const SLASH_SEARCH_REGEX = new RegExp(/(?<!\S)\/[^\s/]{1,}/, 'g');

export const VOICE_CHANNEL_DISPOSITION_FORM_DATE = {
  NAME : 'Anonymous',
  EMAIL : 'none',
  SEARCH_MESSAGE: 'Searching for profiles'
}

export const HiddenQueues = [
  'Voicemail',
  'BlockedVoiceNumber',
  'BPO Metrics Alorica',
  'BPO Metrics Arise',
  'BPO Metrics Brand Email',
  'BPO Metrics Brand SMS',
  'BPO Metrics Brand Webchat',
  'BPO Metrics Internal',
  'BPO Metrics SDA Alorica (Voice)',
  'BPO Metrics SDA Arise (Voice)',
  'BPO Metrics SDA Internal (Voice)',
  'BPO Metrics SDA Qualfon (Voice)',
  'BPO Metrics SDA CCI (Voice)',
  'BPO Metrics Telus',
  'BPO Metrics Qualfon',
  'BPO Metrics CCI',
  'Callbacks (Voice)',
  'External Calls (Voice)',
];

// Availbale queue name to forward call
export const  AvailableQueueList = [
  'Assist - Help (Voice)',
  'Assist - Escalation (Voice)',
  'Borderfree (Voice)',
  'Support CCA (Voice)',
  'Brand Sales & Service (Voice)',
  'Employee Orders (Voice)',
  'NMDLE VIP (Voice)',
  'RTO (Voice)',
  'Support OSRDS (Voice)',
  'Support OSRES (Voice)',
  'Support Scheduling (Voice)',
  'Support WFH (Voice)'
]

