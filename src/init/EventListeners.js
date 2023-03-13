import {
  disconnected,
  ready,
  reservationCreated,
  messageReceived,
  maskingListener,
  callbacksListener,
} from '../events';

export default (flex, manager) => {
  ready(manager);
  disconnected(manager);
  reservationCreated(manager);
  messageReceived(manager);
  maskingListener(manager);
  callbacksListener(flex, manager);
};
