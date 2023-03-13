import ConferenceService from '../services/ConferenceService';

class ExternalWarmTransfer {
  toggleHold = async (payload, original, hold) => {
    const { task, targetSid, participantType } = payload;

    if (
      (participantType !== 'unknown') &&
      !task.source?.transfers?.outgoing?.dateCreated // to enable agents to jump between customer call and their waiting queue call we have to toggle the mute through the API. If a transfer is present, use the API to mute / unmute.
    ) {
      return original(payload);
    }

    const conference =
      task.attributes.conference?.sid || task.conference.conferenceSid;

    const participantSid = targetSid;

    if (hold) {
      console.log('Holding participant', participantSid);
      await ConferenceService.holdParticipant(conference, participantSid);
      return;
    }

    console.log('Unholding participant', participantSid);
    await ConferenceService.unholdParticipant(conference, participantSid);
    return;
  };
}

export default new ExternalWarmTransfer();
