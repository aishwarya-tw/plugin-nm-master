import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/QueuesStatsFilterReducer';
import { REDUX_NAMESPACE, HiddenQueues } from '../../utils/constants';
import { Tabs, Tab } from '@material-ui/core';
import { QueuesStats } from '@twilio/flex-ui';

const filterMap = {
  "All": {
    includes: [""],
    excludes: []
  },
  "BPO Providers": {
    includes: ["Alorica", "Arise", "Qualfon", "Telus", "CCI"],
    excludes: ["Internal"]
  },
  "CCA": {
    includes: ["CCA"],
    excludes: []
  },
  "Digital": {
    includes: ["Brand Email", "Brand SMS", "Brand Webchat", "Digital Stylist Chat", "Elevated Chat", "Digital Stylist SMS", "Holiday Webchat", "Specialist Webchat"],
    excludes: []
  },
  "Internal": {
    includes: ["Assist", "Internal", "Stanley"],
    excludes: []
  },
  "OSR": {
    includes: ["OSRDS", "OSRES", "NMDLE"],
    excludes: []
  },
  "Specialist": {
    includes: ["Specialist"],
    excludes: []
  },
  "Support": {
    includes: ["Fantasy Gifts", "Support", "RTO"],
    excludes: ["CCA", "OSRDS", "OSRES"]
  },
  "Voice": {
    includes: ["Voice"],
    excludes: []
  }
};

class QueueFilters extends Component {
  componentDidMount() {
    this.applyFilter(this.props.selectedFilter);
  }

  applyFilter = (filter) => {
    QueuesStats.setFilter(queue =>
      filterMap[filter].includes.some(searchQuery => queue.friendly_name.includes(searchQuery)) &&
      !filterMap[filter].excludes.some(searchQuery => queue.friendly_name.includes(searchQuery)) &&
      !HiddenQueues.includes(queue.friendly_name)
    );
  }

  setFilter = (event, value) => {
    this.props.updateQueuesFilter(value);
    this.applyFilter(value);
  }

  render() {
    const { selectedFilter } = this.props;
    return (
      <Tabs value={selectedFilter} onChange={this.setFilter} variant="scrollable" scrollButtons="auto">
        <Tab value="All" label="All" />
        <Tab value="BPO Providers" label="BPO Providers" />
        <Tab value="CCA" label="CCA" />
        <Tab value="Digital" label="Digital" />
        <Tab value="Internal" label="Internal" />
        <Tab value="OSR" label="OSR" />
        <Tab value="Specialist" label="Product Specialists" />
        <Tab value="Support" label="Support" />
        <Tab value="Voice" label="Voice" />
      </Tabs>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedFilter: state[REDUX_NAMESPACE].queuesStatsFilter.selectedFilter,
});

const mapDispatchToProps = (dispatch) => ({
  updateQueuesFilter: bindActionCreators(Actions.updateQueuesFilter, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueueFilters);