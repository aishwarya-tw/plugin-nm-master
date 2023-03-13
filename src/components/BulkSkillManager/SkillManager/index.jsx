import React, { Component } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { Notifications } from '@twilio/flex-ui';
import { BACKEND_ERROR_NOTIFICATION } from '../../../utils/constants';
import Resource from '../../../utils/resource';
import AgentList from './AgentList';
import SkillList from './SkillList';
import AttributeManager from './AttributeManager';
import BulkCapacityManager from '../BulkCapacityManager';
import Button from '../Button';
 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../../states/SkillManagerReducer';
import { REDUX_NAMESPACE } from '../../../utils/constants';
import { flattenArray } from '../../../utils/helpers';
 
const UPDATE_WORKER_API_TIMEOUT = 360000;
 
const UpdateWorkerSkillsResource = Resource('update-worker-skills');
const GetWorkerListResource = Resource('get-worker-list');
const SaveWorkerChannelCapacity = Resource('save-worker-channel-capacity');



class SkillManager extends Component {
  submitIsDisabled = () => {
    const agentEmpty = this.props.selectedWorkers.length === 0;
    const skillsEmpty = Object.entries(this.props.skillManager).every(skill => (skill[1].update === false));
    const attributesEmpty = Object.values(this.props.attributeManager).every(value => (value === ""));
    const capacitiesEmpty = Object.keys(this.props.capacities).length === 0;
    return agentEmpty || (skillsEmpty && attributesEmpty && capacitiesEmpty);
  }
 
  resetIsDisabled = () => {
    const updateEmpty = Object.entries(this.props.skillManager).every(skill => (skill[1].update === false));
    const valueEmpty = Object.entries(this.props.skillManager).every(skill => (skill[1].value === false));
    return updateEmpty && valueEmpty;
  }
 
  handleAgentChange = sid => {
    this.props.updateWorkerSelection({ sid });
  }
 
  handleSkillChange = (skill, newValue) => {
    this.props.updateSkills({skill, newValue});
  }
 
  updateTeamManagerList = async () => {
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
 
  updateOpsManagerList = async () => {
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
 
 
  getBulkUpdateCapacityPayload = (capacities) => {
    let bulkUpdatePayload = [];
    const taskChannellist = flattenArray(capacities.workerTaskChannels);
    Object.keys(capacities.capacitiesData).forEach(key => {
      taskChannellist.forEach((taskChannel, index) => {
        if (taskChannel.taskChannelUniqueName.toString() === key.toString()) {
          bulkUpdatePayload.push({
            "key": key,
            "selectedWorker": taskChannel.selectedWorker,
            "newCapacity": capacities.capacitiesData[key],
            "taskChannelSid": taskChannel.sid
          })
        }
      })
    })
    return bulkUpdatePayload;
  }
 
  handleSubmit = () => {
    const { selectedWorkers, skillManager, attributeManager, updateState, capacities } = this.props;
    updateState({loading: true, error: false, message: 'Updating workers...', updating: true});
 
    const skills = Object.entries(skillManager)
      .filter(skill => skill[1].update)
      .map(skill => ({ name: skill[0], value: skill[1].value }));
 
    let workers;
    if (selectedWorkers.length === this.props.workers.length) {
      workers = this.props.workers;
    } else {
      workers = this.props.workers.filter(worker => selectedWorkers.includes(worker.sid));
    }
 
    UpdateWorkerSkillsResource.create({ workers, skills, attributes: attributeManager }, null, UPDATE_WORKER_API_TIMEOUT)
      .then(async (response) => {
        console.log("Update worker skills:", response);
        updateState({loading: false, error: false, message: response.message});
      })
      .catch(error => {
        console.log("Update worker skills:", error);
        Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage: `Failed to update worker skills: ${error}`
        });
        updateState({loading: false, error: true, message: error});
      })
      .finally(() => {
        if (attributeManager.isTeamManager !== "") {
          this.updateTeamManagerList();
        }
        if (attributeManager.isOpsManager !== "") {
          this.updateOpsManagerList();
        }
      });
      // Bulk update Capacity
      const bulkUpdateCapacityPayload = this.getBulkUpdateCapacityPayload(capacities);
      if(bulkUpdateCapacityPayload.length !== 0){
        workers.forEach(worker => {
          const updateTaskChannels = bulkUpdateCapacityPayload.filter(data => data.selectedWorker === worker.sid);
          let taskChannelUpdatesPayload = {};
          updateTaskChannels.forEach(taskChannel => {
            taskChannelUpdatesPayload = {
              ...taskChannelUpdatesPayload,
              [taskChannel.key]: {
                "newCapacity": taskChannel.newCapacity,
                "taskChannelSid" : taskChannel.taskChannelSid
              }
            };
          })
          SaveWorkerChannelCapacity.create({
            taskChannelUpdates: taskChannelUpdatesPayload,
            workerSid: worker.sid
          })
            .then(response => {
              console.log(`Saved worker channel capacity for worker ${worker?.sid}`, response);
            })
            .catch(error => {
              console.log(`error in save capacity lambda: ${error} `);
              Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
                errorMessage: `Failed to update worker channel capacity: ${error}`
              });
              updateState({loading: false, error: true, message: error});
            });
        })
      }
  }
 
  handleCapacityChange = (updatedCapacities) => {
    this.props.bulkUpdateCapacities(updatedCapacities)
  }
 
  render() {
    const {
      workers,
      selectedWorkers,
      isLoading,
      isError,
      message,
    } = this.props;
 
    let content;
    if (message) {
      content = (
        <>
        <Typography component="p" color={isError ? 'error' : 'default'}>
          {message}
        </Typography>
        {isLoading && <CircularProgress />}
        </>
      );
    } else {
      content = (
        <Grid container direction="column">
          <Grid item container justify="flex-start" style={{ marginTop: 16 }}>
            <Button
              text={`${(selectedWorkers.length === workers.length) ? 'unselect' : 'select'} all agents`}
              onClick={this.props.selectAllWorkers}
            />
            <Button
              text="clear skills" disabled={this.resetIsDisabled()}
              onClick={this.props.resetSkills}
            />
          </Grid>
          <Grid container direction="row" style={{marginTop: 16, marginBottom: 16}}>
            <Grid item style={{marginRight: 16}}>
              <AgentList
                agents={workers}
                selection={selectedWorkers}
                handleOnChange={this.handleAgentChange}
              />
            </Grid>
            <Grid item style={{marginRight: 16}}>
              <SkillList skills={this.props.skillManager} handleOnChange={this.handleSkillChange} />
            </Grid>
            <Grid item>
              <AttributeManager />
            </Grid>
            <Grid item style={{paddingLeft: 16}}>
              <BulkCapacityManager agents= {workers} selection={selectedWorkers} onCapacityChange={this.handleCapacityChange}/>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              text="submit"
              onClick={this.handleSubmit}
              disabled={this.submitIsDisabled()}
            />
          </Grid>
        </Grid>
      );
    }
 
    return (
      <Paper elevation={1} style={{ padding: 24 }}>
        <Typography variant="h5" component="h3">
          Skill &amp; Attribute Manager
        </Typography>
        {content}
      </Paper>
    );
  }
}
 
const mapStateToProps = (state) => ({
  workers: state[REDUX_NAMESPACE].skillManager.workers,
  selectedWorkers: state[REDUX_NAMESPACE].skillManager.selectedWorkers,
  skillManager: state[REDUX_NAMESPACE].skillManager.skillManager,
  attributeManager: state[REDUX_NAMESPACE].skillManager.attributeManager,
  isLoading: state[REDUX_NAMESPACE].skillManager.isLoading,
  isError: state[REDUX_NAMESPACE].skillManager.isError,
  message: state[REDUX_NAMESPACE].skillManager.message,
  capacities: state[REDUX_NAMESPACE].skillManager.capacities,
});
 
const mapDispatchToProps = (dispatch) => ({
  updateWorkerSelection: bindActionCreators(Actions.updateWorkerSelection, dispatch),
  selectAllWorkers: bindActionCreators(Actions.selectAllWorkers, dispatch),
  updateSkills: bindActionCreators(Actions.updateSkills, dispatch),
  resetSkills: bindActionCreators(Actions.resetSkills, dispatch),
  updateState: bindActionCreators(Actions.updateState, dispatch),
  updateTeamManagers: bindActionCreators(Actions.updateTeamManagers, dispatch),
  updateOpsManagers: bindActionCreators(Actions.updateOpsManagers, dispatch),
  bulkUpdateCapacities: bindActionCreators(Actions.bulkUpdateCapacities, dispatch),
});
 
export default connect(mapStateToProps, mapDispatchToProps)(SkillManager);
 
 