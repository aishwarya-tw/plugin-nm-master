export function getTaskStatus(task) {
  if (task) {
    return task.taskStatus;
  }
  return undefined;
}

export function getChannelSid(task) {
  if (task && task.attributes) {
    return task.attributes.channelSid;
  }
  return undefined;
}

export function isPostponed(task) {
  if (task && task.attributes) {
    return task.attributes.postponed;
  }
  return false;
}

export function getPostponePeriods(task) {
  if (task && task.attributes) {
    return task.attributes.postponePeriods || [];
  }
  return [];
}