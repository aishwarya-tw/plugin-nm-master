import { Actions as CDTActions } from '../states/CDTRecordsReducer';
import { Actions as ResponseActions } from '../states/ResponseLibraryReducer';
import { Actions as MAQActions } from '../states/ManualAcceptQueuesReducer';
import { Actions as PersonalNumberActions } from '../states/PersonalNumberReducer';
import { bindActionCreators } from 'redux';
import Resource from '../utils/resource';
import * as Flex from '@twilio/flex-ui';

import { BACKEND_ERROR_NOTIFICATION } from '../utils/constants';
const CDTRecordsResource = Resource('get-cdt-records');
const ResponseLibraryResource = Resource('get-response-library-records');
const ManualAcceptQueuesResource = Resource('get-manual-accept-queues');
const PersonalNumberResource = Resource('personal-number-lookup');

let lastFetchedQueueSid = '';

export function fetchCDTRecords(manager, queueSid) {
  console.log("queueSid: ", queueSid, "fetchedQueue: ", lastFetchedQueueSid);
  if (queueSid !== lastFetchedQueueSid || queueSid === '') {
    CDTRecordsResource.read({ queueSid: queueSid })
      .then(result => {
        if (result.body && result.body.length) {
          const loadCDTRecords = bindActionCreators(
            CDTActions.cdtRecordsLoaded,
            manager.store.dispatch
          );
          loadCDTRecords(result.body);
          lastFetchedQueueSid = queueSid
        }
      })
      .catch(err => {
        console.log('ERROR: ', err);
        const errorMessage = 'Could not retrieve CDT survey data.';
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
      });
  }
}

export function fetchResponses(manager) {
  const libraryLoaded = bindActionCreators(
    ResponseActions.responseLibraryLoaded,
    manager.store.dispatch
  );
  const { sid: workerSid } = manager.workerClient;

  ResponseLibraryResource.read({ workerSid })
    .then(response => libraryLoaded(response.body))
    .catch(error => {
      console.log(error);

      const errorMessage = 'Could not retrieve response library.';
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage
      });

      libraryLoaded({ global: [], worker: [] });
    });
}

export function fetchManualAcceptQueues(manager) {
  const loadQueues = bindActionCreators(
    MAQActions.loadQueues,
    manager.store.dispatch
  );

  ManualAcceptQueuesResource.read()
    .then(response => {
      const { queues, retries } = response.message;
      loadQueues({ queues, retries });
    })
    .catch(error => {
      console.error(error);
      const errorMessage = 'Could not retrieve manual accept queues list.';
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage
      });
    });
}

export function fetchPersonalNumber(manager) {
  const savePersonalNumber = bindActionCreators(
    PersonalNumberActions.savePersonalNumber,
    manager.store.dispatch
  );
  const username = manager.user.identity;
  PersonalNumberResource.read({ username })
    .then(response => {
      const phoneNumber = response.message;
      if (phoneNumber) {
        savePersonalNumber(phoneNumber);
      }
    })
    .catch(error => {
      console.error(error);
      const errorMessage = `Could not retrieve worker's personal phone number.`;
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage
      });
    });
}

export default (flex, manager) => {
  // fetchCDTRecords(manager);
  fetchResponses(manager);
  fetchManualAcceptQueues(manager);
  fetchPersonalNumber(manager);
};
