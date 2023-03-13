import React, { Component } from 'react';
import MultiSelect from './MultiSelect';
import { Paper, Typography, Grid } from '@material-ui/core';
import Resource from '../../../utils/resource';
import Button from '../Button';
import { Notifications } from '@twilio/flex-ui';
import { BACKEND_ERROR_NOTIFICATION } from '../../../utils/constants';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../../states/SkillManagerReducer';
import { REDUX_NAMESPACE } from '../../../utils/constants';

const GetWorkerListResource = Resource('get-worker-list');

class WorkerFilters extends Component {
  componentDidMount() {
    if (this.props.teamManagers.length === 0) {
      this.getTeamManagerList();
    }
    if (this.props.opsManagers.length === 0) {
      this.getOpsManagerList();
    }
  }

  getTeamManagerList = async () => {
    const { updateTeamManagers } = this.props;
    const query = `isTeamManager == "true"`;
    await GetWorkerListResource.read({ query })
      .then(response => {
        const { workerList } = response.message;
        const teamManagers = workerList
          .map(worker => JSON.parse(worker.attributes).full_name)
          .filter(worker => worker)
          .sort((a, b) => a.localeCompare(b));
        updateTeamManagers(teamManagers);
      })
      .catch(error => {
        console.log(`Failed to get team managers list: ${error}`);
        Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage: `Could not retrieve team managers list`
        });
      });
  }

  getOpsManagerList = async () => {
    const { updateOpsManagers } = this.props;
    const query = `isOpsManager == "true"`;

    await GetWorkerListResource.read({ query })
      .then(response => {
        const { workerList } = response.message;
        const opsManagers = workerList
          .map(worker => JSON.parse(worker.attributes).full_name)
          .filter(worker => worker)
          .sort((a, b) => a.localeCompare(b));
        updateOpsManagers(opsManagers);
      })
      .catch(error => {
        console.log(`Failed to get ops managers list: ${error}`);
        Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage: `Could not retrieve ops managers list`
        });
      });
  }

  handleTeamManagerSelection = event => {
    this.props.updateFilterSelection({ filter: 'teamManager', value: event.target.value });
  }

  handleOpsManagerSelection = event => {
    this.props.updateFilterSelection({ filter: 'opsManager', value: event.target.value });
  }

  handleBpoProviderSelection = event => {
    this.props.updateFilterSelection({ filter: 'bpoProvider', value: event.target.value });
  }

  handleChannelSelection = event => {
    this.props.updateFilterSelection({ filter: 'channel', value: event.target.value});
  }

  handleSkillSelection = event => {
    this.props.updateFilterSelection({ filter: 'skill', value: event.target.value });
  }

  handleSubmit = () => {
    const {
      teamManagerSelection,
      opsManagerSelection,
      bpoProviderSelection,
      channelSelection,
      skillSelection,
    } = this.props;

    let conditions = [];
    if (teamManagerSelection.length > 0) {
      if(JSON.stringify(teamManagerSelection).includes("Null") ){
        if(teamManagerSelection.length === 1) //only null selected
           conditions.push(`teamManager == Null OR teamManager in ["Null"]`);
        else{ // with null and other selection
        const id = teamManagerSelection.indexOf('Null'); 
        teamManagerSelection.splice(id,  1);  
        conditions.push(`teamManager == Null OR teamManager in ["Null"] OR teamManager in ${JSON.stringify(teamManagerSelection)}`);
        }
    }else //no Null option selected
      conditions.push(`teamManager in ${JSON.stringify(teamManagerSelection)}`);
    }
    if (opsManagerSelection.length > 0) {
      if(JSON.stringify(opsManagerSelection).includes("Null") ){
      if(opsManagerSelection.length === 1)
        conditions.push(`opsManager == Null OR opsManager in ["Null"]`);
      else{
        const id = opsManagerSelection.indexOf('Null'); 
        opsManagerSelection.splice(id,  1);  
        conditions.push(`opsManager == Null OR opsManager in ["Null"] OR opsManager in ${JSON.stringify(teamManagerSelection)}`);
      }
    }else
      conditions.push(`opsManager in ${JSON.stringify(opsManagerSelection)}`);
    }
    if (bpoProviderSelection.length > 0) {
      if(JSON.stringify(bpoProviderSelection).includes("Null") ){
        if(bpoProviderSelection.length === 1)
          conditions.push(`bpoProvider == Null OR bpoProvider in ["Null"]`);
        else{
          const id = bpoProviderSelection.indexOf('Null'); 
          bpoProviderSelection.splice(id,  1);  
          conditions.push(`bpoProvider == Null OR bpoProvider in ["Null"] OR bpoProvider in ${JSON.stringify(bpoProviderSelection)}`);
        }
      }else
        conditions.push(`bpoProvider in ${JSON.stringify(bpoProviderSelection)}`);
    }
    if (channelSelection && typeof(channelSelection) === 'string') {
      if(channelSelection === "Null")
       conditions.push(`routing.skills == Null`);
      else
       conditions.push(`routing.skills HAS '${channelSelection}'`);
    }
    if (skillSelection && typeof(skillSelection) === 'string' ) {
      if(skillSelection === "Null")
       conditions.push(`routing.skills == Null`);
      else
       conditions.push(`routing.skills HAS '${skillSelection}'`);
    }
    console.log("Query....",conditions.join(' AND '));
    this.updateWorkerList(conditions.join(' AND '));

  }

  updateWorkerList = async (query) => {
    const { updateWorkers, updateState } = this.props;
    updateState({loading: true, message: 'Searching for matching workers...'});

    await GetWorkerListResource.read({ query })
    .then(response => {
      const { workerList } = response.message;
      if (workerList.length > 0) {
        const workers = workerList
          .map(worker => ({ ...worker, attributes: JSON.parse(worker.attributes) }))
          .filter(worker => worker.attributes.full_name)
          .sort((a, b) => a.attributes.full_name.localeCompare(b.attributes.full_name));
        updateWorkers(workers);
        updateState({loading: false, error: false, message: ''});
      } else {
        updateState({loading: false, error: true, message: 'No workers were found matching the criteria.'});
      }
    })
    .catch(error=> {
      console.log('Failed to get worker list:', error);
      Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage: `Could not retrieve worker list`
      });
      updateState({loading: false, error: true, message: 'Error retrieving worker list.'});
    });
  }

  render() {
    const {
      teamManagers,
      teamManagerSelection,
      opsManagers,
      opsManagerSelection,
      bpoProviders,
      bpoProviderSelection,
      channels,
      channelSelection,
      skills,
      skillSelection,
      clearFilters,
      isSearchDisabled,
      isFilterDisabled
    } = this.props;
    const teamManagersList = ["Null", ...teamManagers];
    const opsManagersList = ["Null", ...opsManagers];
    const bpoProvidersList = ["Null", ...bpoProviders];
    const channelsList = ["Null", ...channels];
    const skillsList = ["Null", ...skills];
    return (
      <Paper elevation={1} style={{ padding: 24, marginBottom: 24 }}>
        <Typography variant="h5" component="h3">
          Worker Filters
        </Typography>
        <Grid container direction="column">
          <Grid item container direction="row">
            <Grid item>
              <MultiSelect
                name="Team Manager"
                items={teamManagersList}
                onChange={this.handleTeamManagerSelection}
                value={teamManagerSelection}
                multiple={true}
                disabled={isFilterDisabled}
              />
            </Grid>
            <Grid item>
              <MultiSelect
                name="Ops Manager"
                items={opsManagersList}
                onChange={this.handleOpsManagerSelection}
                value={opsManagerSelection}
                multiple={true}
                disabled={isFilterDisabled}
              />
            </Grid>
            <Grid item>
              <MultiSelect
                name="BPO Provider"
                items={bpoProvidersList}
                onChange={this.handleBpoProviderSelection}
                value={bpoProviderSelection}
                multiple={true}
                disabled={isFilterDisabled}
              />
            </Grid>
            <Grid item>
              <MultiSelect
                name="Channel"
                items={channelsList}
                onChange={this.handleChannelSelection}
                value={channelSelection}
                multiple={false}
                disabled={isFilterDisabled}
              />
            </Grid>
            <Grid item>
              <MultiSelect
                name="Skill"
                items={ skillsList }
                onChange={this.handleSkillSelection}
                value={skillSelection}
                multiple={false}
                disabled={isFilterDisabled}
              />
            </Grid>
          </Grid>
          <Grid item container justify="flex-start">
            <Button
              text="Search"
              onClick={this.handleSubmit}
              disabled={isSearchDisabled || isFilterDisabled}
            />
            <Button
              text="clear filters"
              onClick={clearFilters}
              disabled={isSearchDisabled || isFilterDisabled}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  isSearchDisabled: state[REDUX_NAMESPACE].skillManager.isSearchDisabled,
  teamManagers: state[REDUX_NAMESPACE].skillManager.filters.teamManager.data,
  teamManagerSelection: state[REDUX_NAMESPACE].skillManager.filters.teamManager.selection,
  opsManagers: state[REDUX_NAMESPACE].skillManager.filters.opsManager.data,
  opsManagerSelection: state[REDUX_NAMESPACE].skillManager.filters.opsManager.selection,
  bpoProviders: state[REDUX_NAMESPACE].skillManager.filters.bpoProvider.data,
  bpoProviderSelection: state[REDUX_NAMESPACE].skillManager.filters.bpoProvider.selection,
  channels: state[REDUX_NAMESPACE].skillManager.filters.channel.data,
  channelSelection: state[REDUX_NAMESPACE].skillManager.filters.channel.selection,
  skills: state[REDUX_NAMESPACE].skillManager.filters.skill.data,
  skillSelection: state[REDUX_NAMESPACE].skillManager.filters.skill.selection,
  isFilterDisabled: state[REDUX_NAMESPACE].skillManager.isFilterDisabled,
});

const mapDispatchToProps = dispatch => ({
  updateTeamManagers: bindActionCreators(Actions.updateTeamManagers, dispatch),
  updateOpsManagers: bindActionCreators(Actions.updateOpsManagers, dispatch),
  clearFilters: bindActionCreators(Actions.clearFilters, dispatch),
  updateFilterSelection: bindActionCreators(Actions.updateFilterSelection, dispatch),
  updateWorkers: bindActionCreators(Actions.updateWorkers, dispatch),
  updateState: bindActionCreators(Actions.updateState, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerFilters);