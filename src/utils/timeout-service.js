import moment from 'moment';

export default class TimeoutService {
  constructor() {
    this.timeouts = {};
  }

  add(key, thresholdMoment, callbackArgs, callbackFn) {
    if (moment().isSameOrAfter(thresholdMoment)) {
      // If "now" is already after threshold, remove timeout and process callback immediately
      if (!!this.timeouts[key]) {
        clearTimeout(this.timeouts[key]);
        this.remove(key);
      }
      callbackFn(...callbackArgs);
    } else {
      // If threshold has not occurred yet, reset timeout to process callback at threshold
      // Reset is the same as creating a new one, but also clears old timeout if present

      this.reset(key, thresholdMoment, callbackArgs, callbackFn);
    }
  }
  reset(key, thresholdMoment, callbackArgs, callbackFn) {
    const nowMoment = moment();
    if (!!this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
    }
    this.timeouts[key] = setTimeout(() => {
      this.remove(key);
      callbackFn(...callbackArgs);
    }, thresholdMoment.diff(nowMoment));
  }
  remove(key, clearBeforeRemoving = false) {
    if (clearBeforeRemoving) {
      clearTimeout(this.timeouts[key]);
    }
    this.timeouts = Object.entries(this.timeouts)
      .filter(pair => pair[0] !== key)
      .reduce((result, pair) => ({ ...result, [pair[0]]: pair[1] }), {});
  }
  clearAll() {
    Object.keys(this.timeouts).forEach(key => clearTimeout(this.timeouts[key]));
    this.timeouts = {};
  }
}
