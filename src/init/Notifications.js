//import { GeneralActions } from '@twilio/flex-ui/src/actions/GeneralActions';
import * as React from 'react';
import {
  CDT_INCOMPLETE_NOTIFICATION,
  POSTPONE_TASK_LIMIT_NOTIFICATION,
  POSTPONE_WORKER_LIMIT_NOTIFICATION,
  BACKEND_ERROR_NOTIFICATION,
  BACKEND_WARNING_NOTIFICATION,
  RESPONSE_LIBRARY_SAVED_NOTIFICATION,
  GENERAL_ERROR_NOTIFICATION,
  RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION,
  BROWSER_RINGER_NO_DEVICE_NOTIFICATION,
  UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS,
  UPDATED_TRAFFIC_DISTRIBUTION_ERROR,
  GET_TRAFFIC_DISTRIBUTION_ERROR,
  TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID
} from '../utils/constants';

import BrowserRingerNotification from '../components/BrowserRingerDeviceNotification';

function callbacks(flex) {
  flex.Notifications.registerNotification({
    id: 'config-save-success',
    closeButton: true,
    content: 'Configuration successfully saved.',
    timeout: 10000,
    type: flex.NotificationType.success
  });

  flex.Notifications.registerNotification({
    id: 'config-save-error',
    closeButton: true,
    content: 'Failed to save configuration.',
    timeout: 10000,
    type: flex.NotificationType.error
  });

  flex.Notifications.registerNotification({
    id: 'config-delete-success',
    closeButton: true,
    content: 'Configuration successfully deleted.',
    timeout: 10000,
    type: flex.NotificationType.success
  });

  flex.Notifications.registerNotification({
    id: 'config-delete-error',
    closeButton: true,
    content: 'Failed to delete configuration.',
    timeout: 10000,
    type: flex.NotificationType.error
  });
  
  flex.Notifications.registerNotification({
    id: "TasksEnded",
    closeButton:true,
    content: "Task(s) Deleted Sucessfully",
    timeout: 10000,
    type: flex.NotificationType.success
  })
}

function cdt(flex) {
  flex.Notifications.registerNotification({
    id: CDT_INCOMPLETE_NOTIFICATION,
    closeButton: true,
    content: CDT_INCOMPLETE_NOTIFICATION,
    timeout: 5000,
    type: flex.NotificationType.warning
  });
}

function general(flex) {
  flex.Notifications.registerNotification({
    id: GENERAL_ERROR_NOTIFICATION,
    closeButton: true,
    content: GENERAL_ERROR_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.error
  });
}

function postpone(flex) {
  flex.Notifications.registerNotification({
    id: POSTPONE_TASK_LIMIT_NOTIFICATION,
    closeButton: true,
    content: POSTPONE_TASK_LIMIT_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.warning
  });

  flex.Notifications.registerNotification({
    id: POSTPONE_WORKER_LIMIT_NOTIFICATION,
    closeButton: true,
    content: POSTPONE_WORKER_LIMIT_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.warning
  });
}

function backend(flex) {
  flex.Notifications.registerNotification({
    id: BACKEND_ERROR_NOTIFICATION,
    closeButton: true,
    content: BACKEND_ERROR_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.error
  });

  flex.Notifications.registerNotification({
    id: BACKEND_WARNING_NOTIFICATION,
    closeButton: true,
    content: BACKEND_WARNING_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.warning
  });
}

function responseLibrary(flex) {
  flex.Notifications.registerNotification({
    id: RESPONSE_LIBRARY_SAVED_NOTIFICATION,
    closeButton: true,
    content: RESPONSE_LIBRARY_SAVED_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.success
  });

  flex.Notifications.registerNotification({
    id: RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION,
    closeButton: true,
    content: RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION,
    timeout: 10000,
    type: flex.NotificationType.error
  });
}

function browserRinger(flex, manager) {
  const { voiceClient } = manager;
  const { audio } = voiceClient;
  const { availableOutputDevices } = audio;

  const deviceId = localStorage.getItem('RingerDeviceId');
  let deviceExists = false;

  if (deviceId) {
    availableOutputDevices.forEach((device, id) => {
      if (id === deviceId) deviceExists = true;
    });
  }

  if (!deviceExists) {
    flex.Notifications.registerNotification({
      id: BROWSER_RINGER_NO_DEVICE_NOTIFICATION,
      closeButton: true,
      content: <BrowserRingerNotification key="browser-ringer-notification" />,
      timeout: 10000,
      type: flex.NotificationType.warning
    });

    flex.Notifications.showNotification('SetRingerWarning', {
      message:
        'Please choose which device will play your ringer notification audio (Typically computer speakers, not a headset)'
    });
  }
}

function trafficDistribution(flex) {
  flex.Notifications.registerNotification({
    id: UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS,
    closeButton: true,
    content: UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS,
    timeout: 5000,
    type: flex.NotificationType.success
  });

  flex.Notifications.registerNotification({
    id: UPDATED_TRAFFIC_DISTRIBUTION_ERROR,
    closeButton: true,
    content: UPDATED_TRAFFIC_DISTRIBUTION_ERROR,
    timeout: 5000,
    type: flex.NotificationType.error
  });

  flex.Notifications.registerNotification({
    id: GET_TRAFFIC_DISTRIBUTION_ERROR,
    closeButton: true,
    content: GET_TRAFFIC_DISTRIBUTION_ERROR,
    timeout: 5000,
    type: flex.NotificationType.error
  });

  flex.Notifications.registerNotification({
    id: TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID,
    closeButton: true,
    content: TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID,
    timeout: 30000,
    type: flex.NotificationType.error
  });
}

export default (flex, manager) => {
  cdt(flex);
  postpone(flex);
  backend(flex);
  responseLibrary(flex);
  general(flex);
  browserRinger(flex, manager);
  trafficDistribution(flex);
  callbacks(flex, manager);
};
