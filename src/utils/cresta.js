const crestaSkill = 'Cresta';

export const hasWorkEnabledCresta = (worker) => {
  if (!worker ||
      !worker.attributes || 
      !worker.attributes.routing ||
      !worker.attributes.routing.skills) {
    return false;
  }
  for (const skill of worker.attributes.routing.skills) {
    if (skill === crestaSkill) {
      return true;
    }
  }
  return false;
};

export const initCrestaConversation = (channel) => {
  if (!window.crestaEventBus) {
    return;
  }
  const globalChannel = window.crestaEventBus.getChannel('GLOBAL');
  globalChannel.dispatch('cresta:integration:twilio:flex:channel:init', channel)
}