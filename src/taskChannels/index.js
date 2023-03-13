import { TaskChannels } from '@twilio/flex-ui';
import emailChannel from './EmailChannel';
import webchatChannel from './WebChatChannel';

TaskChannels.register(emailChannel);
TaskChannels.register(webchatChannel);