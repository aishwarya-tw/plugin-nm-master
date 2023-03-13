// This component adds a 'My Team' button to the top of the TeamFiltersPanel on the TeamsView page.
// Due to the restrictive nature of the filters, an ops manager's direct reports (team managers) and
// the agents beneath them cannot be displayed at the same time. This button sets up the filters to
// display the agents that belong to the ops manager's team managers (as team managers rarely take
// calls and don't need to be monitored).

// When the button is pressed, the 'Reset' filters button is clicked to clear the filters. Then team
// managers are selected in the filter. Then the 'Apply' filters button is clicked.
// Auto-clicking the 'Apply' button can result in some buggy behavior. If desired the line can be
// removed, so that the filters are still automatically set, but the 'Apply' button must be manually
// clicked.

// An 'Ops Manager' filter has been added in TeamsViewFilterConfiguration.js that will show the team
// managers belonging to the selected ops manager.
// A separate button can be added if desired that could take advantage of this filter to quickly
// display the ops manager's direct reports.

import React, { Component } from 'react';
import { Manager } from '@twilio/flex-ui';
import NMButton from '../NMButton';

const manager = Manager.getInstance();

const btnClass = {
  margin: "auto",
  display: "block",
};

class OpsManagerFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myTeam: [],
    };
  }

  componentDidMount() {
    this.fetchMyTeam();
  }

  fetchMyTeam = async () => {
    const { isOpsManager, isTeamManager, full_name } = manager.workerClient.attributes;
    if (isOpsManager && isOpsManager === "true") {
      let response = await manager.insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.opsManager == "${this.props.userName}"`
      );
      let items = response.getItems();
      const myTeam = Object.values(items).map(member => member.attributes.full_name);
      this.setState({ myTeam });
    } else if(isTeamManager && isTeamManager === "true") {
      this.setState({ full_name });
    }
  };

  showTeam = () => {
    const { isOpsManager, isTeamManager } = manager.workerClient.attributes;
    document.getElementsByClassName('Twilio-FilterListHeader-ResetButton')[0].click();
    
    setTimeout(() => {
      if (isOpsManager && isOpsManager === "true") {
        for (let member of this.state.myTeam) {
          document.getElementById(`${member}___teamManager`).click();
        };
      } else if(isTeamManager && isTeamManager === "true") {
        document.getElementById(`${this.state.full_name}___teamManager`).click();
      }
      
      // Auto-clicking the 'Apply' button is somewhat buggy but generally works.
      // This line can be removed so that only the filters are set, then workers can click apply themselves.
      document.getElementsByClassName('Twilio-FilterListHeader-ApplyButton')[0].click();
    });
  }

  render() {
    return (
      <div>
        <NMButton style={btnClass} onClick={this.showTeam}>My Team</NMButton>
        <br></br>
        <hr />
      </div>
    );
  }
}

export default OpsManagerFilter;