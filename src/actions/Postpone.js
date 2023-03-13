import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();

class Postpone {
  PosptoneTask = payload => {
    const worker = manager.workerClient;
    const currPostponedCount = worker.attributes.postponedCount || 0;
    worker.setAttributes({
      ...worker.attributes,
      postponedCount: currPostponedCount ? currPostponedCount + 1 : 1
    });
  };

  ResumeTask = payload => {
    const worker = manager.workerClient;
    const currPostponedCount = worker.attributes.postponedCount || 0;
    worker.setAttributes({
      ...worker.attributes,
      postponedCount: currPostponedCount - 1
    });
  };
}

export default new Postpone();
