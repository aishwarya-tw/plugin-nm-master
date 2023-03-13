import { Manager } from '@twilio/flex-ui';

import { bindActionCreators } from 'redux';
import { Actions } from '../states/AvailableQueuesReducer';
import { AvailableQueueList } from '../utils/constants';

const manager = Manager.getInstance();

class AvailableQueues {
  updateQueuesList = async (payload) => {
    const { task } = payload;

    const queueQuery = await manager.insightsClient.map({
      id: 'realtime_statistics_v1',
      mode: 'open_existing',
    });

    const queues = await queueQuery.getItems({
      pageSize: 200,
    });
    console.log('updated queue queues ==>', queues);
    const list = queues.items
      .map((queue) => {
        const {
          sid,
          friendly_name, 
          total_available_workers: availableWorkers,
        } = queue.value;
        console.log('updated queue friendly_name ==>', friendly_name);
        return friendly_name !== undefined && [...AvailableQueueList, "Voice"].includes(friendly_name)
          ? { label: friendly_name, value: sid, task: task, available: availableWorkers > 0 ? true : false  }
          : null;
      })
      .filter(i => i);

      console.log('updated queue list ==>', list);
    const queuesList = [] && list;

    const updateList = bindActionCreators(
      Actions.updateAvailableQueues,
      manager.store.dispatch
    );

    updateList(queuesList);
  }
}

export default new AvailableQueues();