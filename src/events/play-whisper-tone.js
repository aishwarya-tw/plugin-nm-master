import Resource from '../utils/resource';

const PollyResource = Resource('get-text-to-speech');

export function playWhisperTone(audio, params) {
  const { task, directory, callback } = params;

  const whisperTone = getWhisperToneText(task, directory);

  PollyResource.read({ text: whisperTone })
    .then(res => {
      console.log("Production Whisper Issue: Asynchronous Retreival of Whisper Tone is about to start")
      const audioStream = res.message.data.AudioStream.data;
      const uInt8Array = new Uint8Array(audioStream);
      const blob = new Blob([uInt8Array.buffer]);
      const url = URL.createObjectURL(blob);
      
      console.log('Audio: Retrieved url for whisper tone:', url);
      
      audio.src = url;
      audio
        .play()
        .then(() => {
          console.log("Production Whisper Issue: Played Retreived Audio");
          audio.onended = () => {
            console.log('Audio Event: Whisper tone audio ended for', audio.src);
            URL.revokeObjectURL(url);
            callback();
          };
        })
        .catch(error => {
          console.log(`Error playing whisper tone audio: ${error}`);
          console.log("Production Whisper Issue: Error retreiving Whisper Tone "  + error)
          URL.revokeObjectURL(url);
          callback();
        });
    })
    .catch(error => {
      console.log('Error caught in response from whisper tone Lambda:', error);
      callback();
    });
}

const getWhisperToneText = (task, directory) => {
  const queueName =
    task.queueName.substring(0, task.queueName.indexOf('(')) || task.queueName;
  let text = '';

  if (task.incomingTransferDescriptor) {
    text =
      task.incomingTransferDescriptor.type === 'QUEUE'
        ? queueName
        : getWorkerName(task);
  } else {
    text = searchDirectory(directory, task.attributes.to);
    if (!text) {
      text = searchDirectory(directory, task.attributes.targetQueue);
    }
  }
  if (!text) {
    if (task.attributes.brand) {
      text = `${task.attributes.brand}${
        task.attributes.preferredLanguage === 'Spanish' ? ' Espanol' : ''
      }`;
    } else {
      text = queueName;
      console.log("Production Whisper Issue: Returned text " + text)
    }
  }
  return text;
};

const searchDirectory = (directory, searchParamater) => {
  console.log("Production Whisper Issue: Searching Directory, Search Parameter " + searchParamater + " Directory" + directory)
  for (const [whisperTone, identifier] of Object.entries(directory)) {
    if (identifier.includes(searchParamater)) {
      return whisperTone;
    }
  }
  return '';
};

const getWorkerName = task => {
  try {
    const { workerSid } = task.incomingTransferDescriptor;
    const { contactUri } = task.attributes.segments.find(
      segment => segment.workerSid === workerSid
    );
    const firstName = contactUri.match(/client:(.+?)_5F/)[1];
    const lastName = contactUri.match(/_5F(.*)_40/)[1].replaceAll('_5F', ' ');

    if (!firstName || !lastName) {
      throw new Error('First name or last name returned empty');
    }
    return `Internal call from ${firstName} ${lastName}`;
  } catch (error) {
    console.log('Error getting worker name from segments:', error);
    return `Direct Transfer`;
  }
};
