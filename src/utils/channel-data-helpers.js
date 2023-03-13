import { Manager } from '@twilio/flex-ui';
import moment from 'moment';
import { ConversationState } from './constants';

export function isMessageAuthorCurrentAgent(message) {
  const { identity } = Manager.getInstance().user;

  const channelType = message.channel.attributes.channel_type;

  const namePattern = /.+?(?=_)/;
  const matched = identity ? identity.match(namePattern) : undefined;

  let firstName = '';
  if (matched && matched.length) {
    firstName = matched[0];
  }

  if (channelType === 'sms') {
    if (message && message.author) {
      return message.author.startsWith(firstName) ? true : false;
    }
  }

  if (channelType === 'email') {
    if (message && message.attributes && message.attributes.source) {
      return message.attributes.source.toLowerCase() !== 'inbound'
        ? true
        : false;
    }
  }

  if (channelType === 'web') {
    if (message && message.author) {
      return message.author.startsWith(firstName) ? true : false;
    }
  }
}

export function getLastMessage(channel) {
  if (channel && channel.source) {
    return channel.source.lastMessage;
  }
  return undefined;
}

export function getConversationState(task, lastMessages) {
  const { postponed } = task.attributes;
  const { agentMessage, customerMessage } = lastMessages;

  if (!customerMessage) {
    // Shouldn't be possible, but handle it anways just to be nice...not sure what you'd do with it but still
    return ConversationState.MissingCustomerMessage;
  } else {
    if (postponed) {
      return ConversationState.Postponed;
    } else {
      if (!agentMessage) {
        return ConversationState.WaitingForAgent;
      } else {
        if (moment(customerMessage.timestamp).isAfter(agentMessage.timestamp)) {
          return ConversationState.WaitingForAgent;
        } else {
          return ConversationState.WaitingForCustomer;
        }
      }
    }
  }
}

export async function findMostRecentMessageByIdentity(
  channel,
  identityComparisonFn
) {
  // Twilio caps this at 100 regardless if you provide a number larger than 100
  // 50 seemed like a good performance/usefulness balance
  const PAGE_SIZE = 15;
  const paginator = await channel.source.getMessages(PAGE_SIZE);
  return await _recursivelyReverseSearchForMessage(
    paginator,
    identityComparisonFn
  );
}

async function _recursivelyReverseSearchForMessage(
  paginator,
  identityComparisonFn
) {
  const { items, hasPrevPage, prevPage } = paginator;
  // Reverse search to find most recent message (items are ordered oldest->newest)
  let message;
  let idx = items.length;
  while (idx-- && message === undefined) {
    const item = items[idx];

    message = identityComparisonFn(item) ? item : undefined;
  }

  if (message !== undefined) {
    // Found the most recent message that passes the identityComparisonFn test

    const { index, timestamp } = message;

    return { index, timestamp };
  } else {
    // No message passing identityComparisonFn test in the current "page" of messages
    if (hasPrevPage) {
      // There are more messages available to search, so get next oldest page and try again
      const prevPaginator = await prevPage();
      return await _recursivelyReverseSearchForMessage(
        prevPaginator,
        identityComparisonFn
      );
    } else {
      // There are no more pages to search, accept defeat
      return undefined;
    }
  }
}
