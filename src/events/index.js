import { Actions } from '../states/AgentConnectivityReducer';
import { ChannelTypes } from '../utils/constants';
import { isMessageAuthorCurrentAgent } from '../utils/channel-data-helpers';
import CDTToolMenu from '../actions/CDTToolMenu';
import { maskingHandler } from './Masking';
import { Actions as FlexActions, ChatOrchestrator } from '@twilio/flex-ui';
import { playWhisperTone } from './play-whisper-tone';
import { fetchCDTRecords } from '../init/DataRetrieval';
import { REDUX_NAMESPACE } from '../utils/constants';
import { setConversations } from './SetConversations';
import { notMissingDispositionData, setVoiceAttributes} from './setVoiceAttribute';

export const maskingListener = manager => {
  if (manager && manager.chatClient) {
    const { chatClient } = manager;
    chatClient.on('messageAdded', message => {
      maskingHandler(message, message.channel.sid);
    });
  }
};

export const disconnected = manager => {
  const store = manager.store;
  const worker = manager.workerClient;
  const now = new Date();

  worker.on('disconnected', () => {
    store.dispatch(Actions.agentConnectivityDisconnected(now));
  });
};

export const ready = manager => {
  const worker = manager.workerClient;
  const store = manager.store;
  worker.on('ready', () => {
    store.dispatch(Actions.agentConnectivityRegained());
  });
};

export const reservationCreated = manager => {
  const { serviceConfiguration } = manager;
  const { NMG } = serviceConfiguration.attributes;
  const { audioAssetsServiceUrl, whisperTones } = NMG;

  let audio = new Audio();
  setAudioListeners(audio);
  audio.crossOrigin = 'anonymous';
  fetchCDTRecords(manager, '');
  manager.workerClient.on('reservationCreated', async reservation => {
    const task = reservation.task;
    const { targetQueue, reservationHistory } = task.attributes;
    const { queues: manualAcceptQueues, retries: reservationRetries } =
      manager.store.getState()[REDUX_NAMESPACE].manualAcceptQueues;

    manager.voiceClient.on("connect", (connection) => {
      console.log("connection object setVoiceAttribute:", connection);
      console.log("parameters setVoiceAttribute:", connection.parameters);
      console.log("callsid setVoiceAttribute:",connection.parameters.CallSid);
      if (connection && connection.parameters && connection.parameters.CallSid){
        localStorage.setItem('AgentCallSid', connection.parameters.CallSid);
      }
    });

    let trueReservation = reservation.addListener?reservation:reservation.source;
    let channelName = trueReservation.task.taskChannelUniqueName;
    if (channelName==='voice'){
      trueReservation.addListener('wrapup', async payload => {
        const {task} = payload;
        let taskSid = task.sid;
        console.log("Reservation listener setVoiceAttribute: wrapup payload", payload);
        let state = manager.store.getState()[REDUX_NAMESPACE];
        if (state.tools[taskSid].DispositionSurvey && 
          notMissingDispositionData(state.tools[taskSid].DispositionSurvey) &&
          task.taskChannelUniqueName === 'voice'){
          setVoiceAttributes(task, state.tools[taskSid].DispositionSurvey, reservation.sid);
        }
          
      });

    }

    _wrapupTask(task, manager); // the wrapup task Action does not fire for voice tasks, so we are using this listener instead

    const isOutboundCall =
      task.taskChannelUniqueName === 'voice' &&
      task.attributes.direction === 'outbound'
        ? true
        : false;
    if (isOutboundCall && !task.attributes.brand) {
      task.setAttributes({
        ...task.attributes,
        brand: 'outbound',
        cdtRequired: 'true'
      });
    }
    
    const isSms = task.taskChannelUniqueName === ChannelTypes.sms;
    if (isSms) {
      task.setAttributes({
        ...task.attributes,
        cdtRequired: 'true',
      })
    }

    const isDigitalChannelsTask =
      reservation.task.taskChannelUniqueName === ChannelTypes.chat ||
      reservation.task.taskChannelUniqueName === ChannelTypes.sms ||
      reservation.task.taskChannelUniqueName === ChannelTypes.email ||
      reservation.task.taskChannelUniqueName === 'chat';

    const isAlertMuted = localStorage.getItem('RingerMuted') === 'true';
    const isVoiceChannelTask =
      task.taskChannelUniqueName === ChannelTypes.voice &&
      task.attributes.callbacks === undefined;
    
    const currentQueue = task.queueName.replace(/\s/g, "").replace("(Voice)","");
    console.log("currentQueue: ", currentQueue);
    const isAutoAcceptDisabled =
      targetQueue &&
      (manualAcceptQueues.includes(targetQueue)||(manualAcceptQueues.includes(currentQueue)));  
  

    if (!isAlertMuted && isDigitalChannelsTask) {
      audio.src = `${audioAssetsServiceUrl}/reservationCreatedSound.mp3`;
    } else if (!isAlertMuted && isVoiceChannelTask) {
      audio.src = `${audioAssetsServiceUrl}/voiceReservationCreatedSound.wav`;
    }

    if (isAutoAcceptDisabled) {
      reservationHistory.push(manager.user.identity);
      await task.setAttributes({
        ...task.attributes,
        reservationHistory,
        sendToVoicemail: (reservationHistory.length > reservationRetries) ? 'true' : 'false',
      });
    }

    const placeHolderCallBack = () => {
      //in case we need to roll back the code, change this to acceptTask()
      console.log("place Holder!!!");
    };

    const acceptTask = () => {
      if (isAutoAcceptDisabled) {
        console.log(`Auto-accept disabled for ${targetQueue}`);
      } else {
        try {
          FlexActions.invokeAction('AcceptTask', { sid: reservation.sid });
          //FlexActions.invokeAction('SelectTask', { sid: reservation.sid });
          console.log(`Auto-accepted task ${task.sid}`);
        } catch (error) {
          console.error(`Failed to auto-accept task ${task.sid}:`, error);
        }
      }
      console.log('new whispertone---');
      const whisperParamsInAccept = {
        task: task,
        directory: whisperTones,
        callback: placeHolderCallBack
      };
      const whisperAudio = new Audio();
      console.log("Production Whisper Issue: Playing Whisper Audio with the Following Variables: whisperAudio " + whisperAudio + " whisperParamsInAccept" + Object.values(whisperParamsInAccept))
      playWhisperTone(whisperAudio, whisperParamsInAccept);
    };

    // const whisperParams = {
    //   task: task,
    //   directory: whisperTones,
    //   callback: acceptTask
    // };

    const deviceId = localStorage.getItem('RingerDeviceId');

    audio
      .setSinkId(deviceId)
      .then(() => console.log(`Set device name: ${deviceId}, to audio Sink Id`))
      .catch(error => console.log('Error setting Sink Id:', error));

    if (!isAlertMuted) {
      audio
        .play()
        .then(() => console.log(`Audio: Played notification audio!`))
        .catch(error => console.log(`Error playing notification sound: ${error}`));
    }

    if (isVoiceChannelTask) {
      acceptTask();
      // const whisperAudio = new Audio();
      // console.log("Production Whisper Issue: Playing Whisper Audio with the Following Variables: whisperAudio " + whisperAudio + " whisperParams" + Object.values(whisperParams))
      // playWhisperTone(whisperAudio, whisperParams);
    }
        
    reservation.on('accepted', (payload) => {
      audio.pause();
      const {task} = payload;
      const { targetQueue } = task.attributes;
      fetchCDTRecords(manager, (targetQueue === 'Stanley') ? targetQueue : task.queueSid);
      if (task && task.attributes && task.queueName && task.taskChannelUniqueName === 'voice') {
        localStorage.setItem('CurrentQueueName', task.queueName);
        localStorage.removeItem("HangUp");   
        localStorage.removeItem('followedBy');
        localStorage.removeItem('toPlace');  
      }                      
    });
    reservation.on('canceled', () => audio.pause());
    reservation.on('rejected', () => audio.pause());
    reservation.on('rescinded', () => audio.pause());
    reservation.on('timeout', () => audio.pause());
  });
};

const _wrapupTask = (task, manager) => {
  task.on('wrapup', () => {
      CDTToolMenu.afterWrapupTask({ task });
      let state = manager.store.getState()[REDUX_NAMESPACE];
      if (task.taskChannelUniqueName !== 'voice'){
        if (state.tools[task.sid].DispositionSurvey && 
          notMissingDispositionData(state.tools[task.sid].DispositionSurvey)){
            setConversations(task, state.tools[task.sid].DispositionSurvey);
        }else {
          setConversations(task, null);
        }
      }
    });
  /*task.on('completed', () => {
    //use this to capture complete task even using task update
    });  */
};

export const messageReceived = manager => {
  const { serviceConfiguration } = manager;
  const { NMG } = serviceConfiguration.attributes;
  const { audioAssetsServiceUrl } = NMG;

  let audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.src = `${audioAssetsServiceUrl}/messageReceivedSound.mp3`;

  manager.chatClient.on('messageAdded', message => {
    const isAlertMuted = localStorage.getItem('RingerMuted') === 'true';

    if (!isAlertMuted && !isMessageAuthorCurrentAgent(message)) {
      const deviceId = localStorage.getItem('RingerDeviceId');

      audio.setSinkId(deviceId);

      audio
        .play()
        .then(() => console.log(`Played audio!`))
        .catch(error => console.log(`Error playing audio: ${error}`));
    }
  });
};

export const callbacksListener = (flex, manager) => {
  flex.Actions.addListener('afterAcceptTask', async payload => {
    if (
      payload.task.attributes.callbacks &&
      payload.task.attributes.callbacks.phone_number &&
      payload.task.taskChannelUniqueName === ChannelTypes.callback
    ) {
      await payload.task.setAttributes({
        ...payload.task.attributes,
        callbacks: {
          ...payload.task.attributes.callbacks,
          state: 'initiated'
        }
      });

      await payload.task.complete();

      flex.Actions.invokeAction('StartOutboundCall', {
        destination: payload.task.attributes.callbacks.phone_number,
        taskAttributes: payload.task.attributes,
        queueSid: payload.task.queueSid
      });

      manager.voiceClient.on('connect', async function (connection) {
        await payload.task.setAttributes({
          ...payload.task.attributes,
          callbacks: {
            ...payload.task.attributes.callbacks,
            state: 'success'
          }
        });
      });
    }
  });
};

const setAudioListeners = audio => {
  console.log('Setting audio listeners');
  audio.onabort = () => {
    console.log(
      `Audio Event: onaborted event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
  audio.onerror = () => {
    console.log(
      `Audio Event: onerror event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
  audio.onstalled = () => {
    console.log(
      `Audio Event: onstalled event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
  audio.onwaiting = () => {
    console.log(
      `Audio Event: onwaiting event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
  audio.onplaying = () => {
    console.log(
      `Audio Event: onplaying event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
  audio.onsuspend = () => {
    console.log(
      `Audio Event: onsuspended event triggered for the audio: ${
        audio ? audio.src : null
      }`
    );
  };
};
