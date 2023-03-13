export default (flex, manager) => {
  const { attributes } = manager.serviceConfiguration;
  const callbackChannel = attributes.NMG.callbackChannel || 'Callbacks';

  const VoiceCallbacksChannel =
    flex.DefaultTaskChannels.createDefaultTaskChannel(
      'Voice Callbacks',
      task => task.taskChannelUniqueName === callbackChannel
    );
  flex.TaskChannels.register(VoiceCallbacksChannel);
};
