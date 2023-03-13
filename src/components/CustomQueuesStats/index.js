import React from 'react';
import { AgentAuxActivities as Aux } from '../../utils/constants';

const aux_counter = (acc, val) => {
  if (Aux.includes(val.friendly_name.trim())) {
    return acc + val.workers;
  } else {
    return acc;
  }
};

const acw_counter = (acc, val) => {
  if ('Unavailable' === val.friendly_name.trim()) {
    return acc + val.workers;
  } else {
    return acc;
  }
};

const aux = q => {
  return q.activity_statistics.reduce(aux_counter, 0);
};

const acw = q => {
  return q.activity_statistics.reduce(acw_counter, 0);
};

export function cqsSort(props) {
  const { column, a, b } = props;
  let result = 0;

  switch (column) {
    case 'staff':
      result = a.total_eligible_workers - b.total_eligible_workers;
      break;
    case 'avail':
      result = a.total_available_workers - b.total_available_workers;
      break;
    case 'queue':
      result = a.total_tasks - b.total_tasks;
      break;
    case 'calls':
      result = a.tasks_by_status.assigned - b.total_tasks;
      break;
    case 'acw':
      result = acw(a) - acw(b);
      break;
    case 'aux':
      result = aux(a) - aux(b);
      break;
    default:
  }
  return result;
}

export function cqsContent(props) {
  const q = props.queue;
  const { assigned } = q.tasks_by_status;
  const staff = q.total_eligible_workers;

  const metric = {
    staff: staff,
    avail: q.total_available_workers,
    queue: q.total_tasks,
    calls: assigned,
    acw: acw(q),
    aux: aux(q)
  };

  return <span style={{ fontWeight: 'bold' }}>{metric[props.type]}</span>;
}

const auxCalc = (queue, activity) => {
  return queue.activity_statistics.filter(item => item.friendly_name === activity).map(item => item.workers);
  // return Aux.map(activity => queue.activity_statistics.filter(item => item.friendly_name === activity).map(item => item.workers));
}

export function auxContent(queue, activity) {
  const activityCounts = auxCalc(queue, activity);

  return <span style={{ fontWeight: 'bold' }}>{activityCounts}</span>;
  // return <span style={{ fontWeight: 'bold' }}>{activityCounts.join(delimiter)}</span>;
}

export function auxSort(props, activity) {
  const { a, b } = props;
  return auxCalc(a, activity) - auxCalc(b, activity);
  // return listSum(auxCalc(a)) - listSum(auxCalc(b));
}
