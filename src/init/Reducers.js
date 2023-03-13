import { VERSION } from '@twilio/flex-ui';

import reducers from '../states';
import { REDUX_NAMESPACE } from '../utils/constants';

export default (flex, manager) => {
  if (!manager.store.addReducer) {
    // eslint: disable-next-line
    console.error(
      `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
    );
    return;
  }

  manager.store.addReducer(REDUX_NAMESPACE, reducers);
};
