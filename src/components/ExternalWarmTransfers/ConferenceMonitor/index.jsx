import * as React from 'react';
import ConferenceService from '../../../services/ConferenceService';

class ConferenceMonitor extends React.Component {
  state = {
    liveParticipantCount: 0
  };

  componentDidUpdate() {
    const { task } = this.props;
    const conference = task && (task.conference || {});
    const {
      conferenceSid,
      liveParticipantCount,
      participants = []
    } = conference;
    const liveParticipants = participants.filter(p => p.status === 'joined');

    if (liveParticipantCount > 2 && this.state.liveParticipantCount <= 2) {
      this.handleMoreThanTwoParticipants(conferenceSid, liveParticipants);
    } else if (
      liveParticipantCount <= 2 &&
      this.state.liveParticipantCount > 2
    ) {
      this.handleOnlyTwoParticipants(conferenceSid, liveParticipants);
    }

    if (liveParticipantCount !== this.state.liveParticipantCount) {
      this.setState({ liveParticipantCount });
    }
  }

  handleMoreThanTwoParticipants = (conferenceSid, participants) => {
    console.log(
      'More than two conference participants. Setting endConferenceOnExit to false for all participants.'
    );
    this.setEndConferenceOnExit(conferenceSid, participants, false);
  };

  handleOnlyTwoParticipants = (conferenceSid, participants) => {
    console.log(
      'Conference participants dropped to two. Setting endConferenceOnExit to true for all participants.'
    );
    this.setEndConferenceOnExit(conferenceSid, participants, true);
    //Logic to check and unhold the non worker participant in the call, when the participants count goes down to two.
    this.unholdCallonOnlyTwoParticipants(conferenceSid, participants);
  };

  //Function to unhold participant in conference.
  unholdCallonOnlyTwoParticipants = async (conferenceSid, participants) => {
    console.log(
      `Unholding remaining participants for conference ${conferenceSid}`
    );
    const promises = [];

    if (this.workerIsParticipant(participants)) {
      console.log('A worker is present, participants will remain on hold');
      return;
    }

    for (const participant of participants) {
      if (participant.source.hold) {
        console.log(`Unholding participant ${participant.callSid}`);
        promises.push(
          ConferenceService.unholdParticipant(
            conferenceSid,
            participant.callSid
          )
        );
      }
    }

    try {
      await Promise.all(promises);
      console.log('unhold all participants');
    } catch (error) {
      console.log('Error unholding all participants');
    }
  };

  workerIsParticipant = participants => {
    for (const participant of participants) {
      if (
        participant &&
        participant.source &&
        participant.source.participant_type === 'worker'
      ) {
        return true;
      }
    }
    return false;
  };

  setEndConferenceOnExit = async (
    conferenceSid,
    participants,
    endConferenceOnExit
  ) => {
    const promises = [];
    participants.forEach(p => {
      console.log(
        `setting endConferenceOnExit = ${endConferenceOnExit} for callSid: ${p.callSid} status: ${p.status}`
      );
      if (p.connecting) {
        return;
      } //skip setting end conference on connecting parties as it will fail
      promises.push(
        ConferenceService.setEndConferenceOnExit(
          conferenceSid,
          p.callSid,
          endConferenceOnExit
        )
      );
    });

    try {
      await Promise.all(promises);
      console.log(
        `endConferenceOnExit set to ${endConferenceOnExit} for all participants`
      );
    } catch (error) {
      console.error(
        `Error setting endConferenceOnExit to ${endConferenceOnExit} for all participants\r\n`,
        error
      );
    }
  };

  render() {
    // This is a Renderless Component, only used for monitoring and taking action on conferences
    return null;
  }
}

export default ConferenceMonitor;
