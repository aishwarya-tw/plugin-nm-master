/*
 * helpful few line functions that may be used across multiple components
 */

import moment from 'moment';
import {
  DATA_UNAVAILABLE_TEXT,
  IMAGE_EXTENSIONS,
  PLATINUM_CHAT_IMAGE_EXTENSIONS
} from './constants';

export const renderValue = value => (value ? value : DATA_UNAVAILABLE_TEXT);
export const renderDate = (date, format) =>
  date ? moment.utc(date).format(format) : DATA_UNAVAILABLE_TEXT;
export const renderAddress = address => {
  let addrText = '';
  addrText += address.city || '';
  addrText += address.state ? `, ${address.state}` : '';
  addrText += address.country ? `, ${address.country}` : '';
  return addrText || DATA_UNAVAILABLE_TEXT;
};

export const isImage = extension => {
  if (!extension) {
    return false;
  }

  return IMAGE_EXTENSIONS.includes(extension.toLowerCase());
};

export const isPlatImageSupported = ({ name }, isPlatinum) => {
  if (!name) {
    return false;
  }

  const nameParts = name.split('.');
  const extension = nameParts[nameParts.length - 1];

  return PLATINUM_CHAT_IMAGE_EXTENSIONS.includes(extension.toLowerCase());
};

export const flattenArray = (arr, result = []) => {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flattenArray(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
};
