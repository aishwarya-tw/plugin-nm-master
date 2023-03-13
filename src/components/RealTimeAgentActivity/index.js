import React from 'react';
import TeamsViewCard from './TeamsViewCard/TeamsViewCard.container';
import { ColumnDefinition } from '@twilio/flex-ui';
import { Actions } from '../../states/RealTimeAgentActivityReducer';
import { bindActionCreators } from 'redux';
import { Manager } from '@twilio/flex-ui';
import Resource from '../../utils/resource';

const RealTimeWorkerData = Resource('getAgentActivityStats');

const _setIntervalUpdate = async () => {
  const manager = Manager.getInstance();
  const store = manager.store;
  const workers = store.getState().flex.supervisor.workers;
  const workersArray = workers.map(worker => worker.worker.sid);
  const getAgentData = bindActionCreators(Actions.getAgentData, store.dispatch);
  const isTeamsViewOpen = store.getState().flex.view.activeView === 'teams';

  // Will only begin retrieving data from Lambda once the TeamsView page is selected and a worker array created
  if (workers && workers.length !== 0 && isTeamsViewOpen) {
    RealTimeWorkerData.create({
      worker_sids: workersArray
    })
      .then(result => {
        getAgentData(result);
      })
      .catch(err => {
        console.log(
          'Error retrieving supplementary data for Teams View: ',
          err
        );
      });
  }
};

const _setColumns = flex => {
  [
    ['tasks', 'Handled', 'tasks'],
    ['tasks', 'Timeout', 'tasks'],
    ['tasks', 'Declined', 'tasks'],
    ['capacity', 'Voice / Chat / Email / SMS']
  ].forEach(q => {
    flex.WorkersDataTable.Content.add(
      <ColumnDefinition
        key={`tv-col-${q}`}
        header={q[0].toUpperCase()}
        subHeader={q[1]}
        headerColSpanKey={q[2]}
        content={item => <TeamsViewCard content={item} type={q} />}
        style={{ width: 250 + 'px' }}
      />,
      { sortOrder: 0 }
    );
  });
};

async function RealTimeAgentActivity(flex, manager) {
  _setColumns(flex);
  setInterval(_setIntervalUpdate, 5000);
}

export default RealTimeAgentActivity;
