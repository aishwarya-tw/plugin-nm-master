import Resource from '../utils/resource';
import { bindActionCreators } from 'redux';
import { Actions } from '../states/CmdReducer';
import * as Flex from '@twilio/flex-ui';
import { Manager } from '@twilio/flex-ui';
import { connect } from 'react-redux';
import {
  REDUX_NAMESPACE,
  BACKEND_ERROR_NOTIFICATION
} from '../utils/constants';

const CMDProfilesResource = Resource('cmd-profiles');
const manager = Manager.getInstance();

class GetCMDData{
  afterAcceptTask = (payload, setToolState) => {

    var attributes = payload.task._task.attributes;

    CMDProfilesResource.create({ attributes })
    .then(data => {
      const setCmdProfile = bindActionCreators(
        Actions.setCmdProfile,
        manager.store.dispatch
      );
      console.log("GetCMDData get CMD Profilee ==> ",data);
      setCmdProfile({taskId: payload.task._task.sid, data: data});

      window.dispatchEvent(new Event('storage'))  

    })
    .catch(error => {
      console.log('Error retrieving CMD profiles', error);
      const errorMessage = `Could not retrieve profiles from CMD. ${error}`;
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage
      });
    });
  };
}


export default new  GetCMDData();




