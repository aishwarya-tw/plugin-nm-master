import { ConferenceParticipant, Manager} from '@twilio/flex-ui';
import Resource from '../utils/resource';
import { BACKEND_ERROR_NOTIFICATION } from '../utils/constants';
import * as Flex from '@twilio/flex-ui';

const HoldParticipantResource = Resource('hold-conference-participant');
const UpdateConferenceParticipantResource = Resource(
  'update-conference-participant'
);
const AddConferenceParticipantResource = Resource('add-conference-participant');
const RemoveConferenceParticipantResource = Resource(
  'remove-conference-participant'
);
const UpdateExternalCallTask = Resource('update-external-call');

class ConferenceService {
  constructor() {
    const manager = Manager.getInstance();
    this.serviceBaseUrl = manager.configuration.serviceBaseUrl;
  }

  // Private functions
  _getUserToken = () => {
    const manager = Manager.getInstance();
    return manager.user.token;
  };

  _toggleParticipantHold = async (conference, participantSid, hold) => {
    const token = this._getUserToken();

    try {
      await HoldParticipantResource.create({
        token: token,
        conference: conference,
        participant: participantSid,
        hold: hold
      });

      console.log(
        `${hold ? 'Hold' : 'Unhold'} successful for participant`,
        participantSid
      );
    } catch (error) {
      console.error(
        `Error ${
          hold ? 'holding' : 'unholding'
        } participant ${participantSid}\r\n`,
        error
      );

      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage: `Failed to hold conference participant: ${error}`
      });
    }

    // ye olden way

    // return new Promise((resolve, reject) => {
    //   const token = this._getUserToken();
    //   return fetch(
    //     `https://${this.serviceBaseUrl}/hold-conference-participant`,
    //     {
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       method: 'POST',
    //       body:
    //         `token=${token}` +
    //         `&conference=${conference}` +
    //         `&participant=${participantSid}` +
    //         `&hold=${hold}`
    //     }
    //   )
    //     .then(() => {
    //       console.log(
    //         `${hold ? 'Hold' : 'Unhold'} successful for participant`,
    //         participantSid
    //       );
    //       resolve();
    //     })
    //     .catch(error => {
    //       console.error(
    //         `Error ${
    //           hold ? 'holding' : 'unholding'
    //         } participant ${participantSid}\r\n`,
    //         error
    //       );
    //       reject(error);
    //     });
    // });
  };

  // Public functions
  setEndConferenceOnExit = async (
    conference,
    participantSid,
    endConferenceOnExit
  ) => {
    const token = this._getUserToken();

    try {
      await UpdateConferenceParticipantResource.create({
        token,
        conference,
        endConferenceOnExit,
        participant: participantSid
      });

      console.log(`Participant ${participantSid} updated:\r\n`);
    } catch (error) {
      console.error(`Error updating participant ${participantSid}\r\n`, error);

      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage: `Failed to update conference participant: ${error}`
      });
    }

    // YE OLDEN WAY

    // fetch(`https://${this.serviceBaseUrl}/update-conference-participant`, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   body:
    //     `token=${token}` +
    //     `&conference=${conference}` +
    //     `&participant=${participantSid}` +
    //     `&endConferenceOnExit=${endConferenceOnExit}`
    // })
    //   .then(response => response.json())
    //   .then(json => {
    //     if (json && json.status === 200) {
    //       console.log(`Participant ${participantSid} updated:\r\n`, json);
    //       resolve();
    //     }
    //   })
    //   .catch(error => {
    //     console.error(
    //       `Error updating participant ${participantSid}\r\n`,
    //       error
    //     );
    //     reject(error);
    //   });
    // });
  };

  addParticipant = async (taskSid, from, to, conferenceSid, transferType, storeName, workerSid, reservationSid, queueName) => {
    const token = this._getUserToken();

    try {
      const response = await AddConferenceParticipantResource.create({
        token,
        taskSid,
        from,
        to,
        conferenceSid,
        transferType,
        storeName,
        workerSid,
        queueName
      });
      console.log('Participant added:\r\n  ');

      //add followedBy and destination(toPlace) for Flex Insights 
      let followBy = transferType.toUpperCase()+":EXTERNAL:initiated";
      let toPlace = (storeName.length>0) ? storeName : to; 
      localStorage.setItem('followedBy', followBy);
      localStorage.setItem('toPlace', toPlace);

      return response.message.callSid;
    } catch (error) {
      console.log(error);
      console.error(`Error adding participant to task ${taskSid}\r\n`, error);

      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage: `Failed to update conference participant: ${error}`
      });
    }

    // fetch(`https://${this.serviceBaseUrl}/add-conference-participant`, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   body: `token=${token}&taskSid=${taskSid}&from=${from}&to=${to}`
    // })
    //   .then(response => response.json())
    //   .then(json => {
    //     if (json.status === 200) {
    //       console.log('Participant added:\r\n  ', json);
    //       resolve(json && json.callSid);
    //     }
    //   })
    //   .catch(error => {
    //     console.error(`Error adding participant ${to}\r\n`, error);
    //     reject(error);
    //   });
  };

  addConnectingParticipant = (conferenceSid, callSid, participantType) => {
    const flexState = Manager.getInstance().store.getState().flex;
    const dispatch = Manager.getInstance().store.dispatch;
    const conferenceStates = flexState.conferences.states;
    const conferences = new Set();

    console.log('Populating conferences set');
    conferenceStates.forEach(conference => {
      const currentConference = conference.source;
      console.log('Checking conference SID:', currentConference.conferenceSid);
      if (currentConference.conferenceSid !== conferenceSid) {
        console.log('Not the desired conference');
        conferences.add(currentConference);
      } else {
        const participants = currentConference.participants;
        const fakeSource = {
          connecting: true,
          participant_type: participantType,
          status: 'joined'
        };
        const fakeParticipant = new ConferenceParticipant(fakeSource, callSid);
        console.log('Adding fake participant:', fakeParticipant);
        participants.push(fakeParticipant);
        conferences.add(conference.source);
      }
    });
    console.log('Updating conferences:', conferences);
    dispatch({ type: 'CONFERENCE_MULTIPLE_UPDATE', payload: { conferences } });
  };

  holdParticipant = async (conference, participantSid) => {
    await this._toggleParticipantHold(conference, participantSid, true);
    return;
  };

  unholdParticipant = async (conference, participantSid) => {
    await this._toggleParticipantHold(conference, participantSid, false);
    return;
  };

  removeParticipant = async (conference, participantSid) => {
    const token = this._getUserToken();
    try {
      await RemoveConferenceParticipantResource.create({
        token,
        conference,
        participant: participantSid
      });
      console.log(`Participant ${participantSid} removed from conference`);
    } catch (error) {
      console.log(error);
      console.error(`Error updating participant ${participantSid}\r\n`, error);

      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage: `Failed to update conference participant: ${error}`
      });
    }

    // YE OLDEN WAY

    // fetch(`https://${this.serviceBaseUrl}/remove-conference-participant`, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   body:
    //     `token=${token}` +
    //     `&conference=${conference}` +
    //     `&participant=${participantSid}`
    // })
    //   .then(() => {
    //     console.log(`Participant ${participantSid} removed from conference`);
    //     resolve();
    //   })
    //   .catch(error => {
    //     console.error(
    //       `Error removing participant ${participantSid} from conference\r\n`,
    //       error
    //     );
    //     reject(error);
    //   });
  };

  updateExternalCallTask = async (callSid, extension) => {
    console.log("updateExternalCallTask", callSid+" "+extension);
    const token = this._getUserToken();
    try {
      console.log("sending"+extension);
      await UpdateExternalCallTask.create({
          token,
          participant: callSid,
          status: extension
        });
     } catch (error) {
      console.error(`Error updating external task`, error);
    }    
  }
}

const conferenceService = new ConferenceService();

export default conferenceService;
