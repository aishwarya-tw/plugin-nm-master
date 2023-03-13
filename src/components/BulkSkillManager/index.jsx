import React, { Component } from 'react';

import WorkerFilters from './WorkerFilters';
import SkillManager from './SkillManager';
import Scrollable from '../ToolContainer/Scrollable';

class BulkSkillManager extends Component {
  render() {
    return (
      <Scrollable>
        <div style={{margin: 24}}>
          <WorkerFilters />
          <SkillManager />
        </div>
      </Scrollable>
    );
  }
}

export default BulkSkillManager;