import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';

import { Typography, withStyles, CircularProgress } from '@material-ui/core';
import ToolHeader from '../ToolContainer/Header';
import styles from './styles';
import Resource from '../../utils/resource';
import Channel from './Channel';
import { Manager, Notifications, Actions } from '@twilio/flex-ui';
import { GENERAL_ERROR_NOTIFICATION } from '../../utils/constants';
const clearTaskApiCall = Resource('clear-tasks');

let manager = Manager.getInstance();
const GetWorkerChannelList = Resource('get-worker-channels-list');
const SaveWorkerChannelCapacity = Resource('save-worker-channel-capacity');

class CapacityManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selectedWorker: null,
      selectedWorkerTaskChannels: [],
      taskChannelUpdates: {}
    };

    this.inputRefs = [];
    this.setInputRef = this.setInputRef.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.updateWorkerChannelCapacity =
      this.updateWorkerChannelCapacity.bind(this);
  }

  componentDidMount() {
    const { worker } = this.props;
    const { sid: workerSid } = worker && worker.sid ? worker : '';

    this.setState({ loading: true, showSuccessMessage: false });

    GetWorkerChannelList.read({ workerSid: workerSid })
      .then(result => {
        this.mapWorkerChannelInformation(result);
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  mapWorkerChannelInformation(result) {
    // function to populate the worker channel cacpacity retrieved from Lambda to Text box on the Capacity Manager

    if (
      result.message &&
      Object.hasOwnProperty.call(result.message, 'channels') &&
      result.message.channels.length > 0
    ) {
      const newChannelMapping = [];
      result.message.channels.forEach(channel => {
        this.setState({
          ...this.state,
          configuredCapacity: {
            ...this.state.configuredCapacity,
            [channel.taskChannelUniqueName]: channel.configuredCapacity
          }
        });
        newChannelMapping.push({
          taskChannelUniqueName: channel.taskChannelUniqueName,
          sid: channel.sid,
          configuredCapacity: channel.configuredCapacity
        });
      });

      this.setState({
        selectedWorker: this.props.worker.sid,
        selectedWorkerTaskChannels: newChannelMapping,
        taskChannelUpdates: undefined,
        showSuccessMessage: false,
        showFailedMessage: false
      });
    } else {
      console.log('Could not retrieve worker Channel information');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // past
    const { worker } = this.props; // present tense
    const { sid: workerSid } = worker;
    if (
      prevProps.worker.sid &&
      workerSid &&
      workerSid !== prevProps.worker.sid
    ) {
      this.setState({ loading: true });
      GetWorkerChannelList.read({ workerSid: this.props.worker.sid })
        .then(result => {
          this.mapWorkerChannelInformation(result);
          this.setState({ loading: false });
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
    }
  }

  handleCapacityChange(channel, oldCapacity, newCapacity) {
    if (newCapacity !== oldCapacity) {
      console.log(
        'CAP ' +
          channel.taskChannelUniqueName +
          ' oldCapacity = ' +
          oldCapacity +
          ' newCapacity = ' +
          newCapacity
      );
      this.setState({
        ...this.state,
        taskChannelUpdates: {
          ...this.state.taskChannelUpdates,
          [channel.taskChannelUniqueName]: {
            newCapacity,
            taskChannelSid: channel.sid
          }
        }
      });
    }
    console.log(
      'CAP taskChannelUpdates inside handleCapacityChange ' +
        JSON.stringify(this.state.taskChannelUpdates)
    );
  }
  handleRemoveTasks = () => {
    try {
      let workerSid = this.props.worker.sid;
      const workers = manager.store.getState()?.flex?.supervisor?.workers || [];
      let workerTasks;
      
      workers.forEach(item => {
        if (item.worker.sid == workerSid) {
          workerTasks = item.tasks;
        }
      });
      console.log({workerTasks})
      //Dont Make API call if worker has no tasks
      if (Object.keys(workerTasks).length == 0) {
        Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
          errorMessage: 'No Current Accepted Tasks'
        });
       
        return;
      }

      clearTaskApiCall
        .create({
          workerTasks
        })
        .then(response => {
          console.log('Tasks Deleted Sucessfully');
          Notifications.showNotification("TasksEnded")
        })
        .catch(error => {
          console.log('Task Deletion Failed');
        });
    } catch (error) {
      Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
        errorMessage: 'Error Ending Tasks' + error
      });
    }
  };

  updateWorkerChannelCapacity() {
    // Function to pass the updated worker channel capactity to Lambda to update the twilio console
    const {
      taskChannelUpdates,
      selectedWorker,
      selectedWorkerTaskChannels,
      placeHolderChannelUpdates = {}
    } = this.state;
    let parsedTaskChannelUpdates = {};
    Object.keys(taskChannelUpdates).forEach(key => {
      if (taskChannelUpdates[key].newCapacity !== '') {
        parsedTaskChannelUpdates[key] = taskChannelUpdates[key];
      }
    });

    console.log(
      'CAP taskChannelUpdates inside updateWorkerChannelCapacity' +
        JSON.stringify(parsedTaskChannelUpdates)
    );

    this.setState({ ...this.state, showFailedMessage: false, loading: true });
    SaveWorkerChannelCapacity.create({
      taskChannelUpdates: parsedTaskChannelUpdates,
      workerSid: selectedWorker
    })
      .then(data => {
        const configuredCapacities = { ...this.state.configuredCapacity };

        console.log(`Saved worker channel capacity for worker`);
        console.log(
          'CAP selectedWorkerTaskChannels ' +
            JSON.stringify(selectedWorkerTaskChannels)
        );

        selectedWorkerTaskChannels.forEach(channel => {
          if (taskChannelUpdates[channel.taskChannelUniqueName]) {
            configuredCapacities[channel.taskChannelUniqueName] =
              taskChannelUpdates[channel.taskChannelUniqueName].newCapacity;
          }
        });

        this.setState({
          loading: false,
          showSuccessMessage: true,
          configuredCapacity: configuredCapacities,
          placeHolderChannelUpdates: {
            ...placeHolderChannelUpdates,
            ...taskChannelUpdates
          },
          taskChannelUpdates: {}
        });
      })
      .catch(error => {
        this.setState({ loading: false, showFailedMessage: true });
        console.log(`error in save capacity lambda: ${error} `);
      });
  }

  setInputRef(ref) {
    //function to change the reference for all the input (text) fields
    if (!this.inputRefs.some(inputRef => inputRef === ref)) {
      if (ref && ref !== null) {
        this.inputRefs.push(ref);
      }
    }
  }

  handleClearFilters = () => {
    const { selectedWorkerTaskChannels, configuredCapacity } = this.state;
    const newTaskChannelUpdates = {};

    selectedWorkerTaskChannels.forEach(channel => {
      newTaskChannelUpdates[channel.taskChannelUniqueName] = {
        newCapacity: configuredCapacity[channel.taskChannelUniqueName],
        taskChannelSid: channel.sid,
        configuredCapacity: configuredCapacity[channel.taskChannelUniqueName]
      };
    });

    this.setState({ ...this.state, taskChannelUpdates: newTaskChannelUpdates });
    this.inputRefs.forEach(ref => {
      if (ref) {
        ref.value = '';
      }
    });
  };

  render() {
    const {
      selectedWorker = [],
      selectedWorkerTaskChannels,
      loading,
      taskChannelUpdates,
      placeHolderChannelUpdates = {}
    } = this.state;
    const { classes } = this.props;

    const hasUpdates = tasks => {
      const taskLength = Object.values(tasks).length;
      return (
        Object.values(tasks).filter(item => !item.newCapacity).length ===
        taskLength
      );
    };
    return (
      <>
        <div>
          <ToolHeader
            label={
              <div>
                <Typography variant="h8" className={classes.toolLabel}>
                  Kill Tasks
                </Typography>
              </div>
            }
          />
          <Flex.Button
            onClick={this.handleRemoveTasks}
            className={classes.endTasksButton}
          >
            Kill All Stuck Tasks
          </Flex.Button>
        </div>
        <ToolHeader
          label={
            <div>
              <Typography variant="h8" className={classes.toolLabel}>
                Worker Channel Capacity
              </Typography>
            </div>
          }
        />

        {!loading && (
          <Channel
            handleCapacityChange={this.handleCapacityChange}
            selectedWorker={selectedWorker}
            selectedWorkerTaskChannels={selectedWorkerTaskChannels}
            taskChannelUpdates={taskChannelUpdates}
            placeHolderChannelUpdates={placeHolderChannelUpdates}
            setInputRef={this.setInputRef}
          />
        )}
        {loading && (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {this.state.showSuccessMessage && (
          <p align="center">Worker Capacity changes updated Successfully!.</p>
        )}
        {this.state.showFailedMessage && (
          <p align="center"> Not able to Update Worker Channel Capacity.</p>
        )}
        <div className={classes.secondaryWrapper}>
          <div className={classes.filterBtnsWrapper}>
            <Flex.Button
              className={classes.saveButton}
              onClick={this.updateWorkerChannelCapacity}
              disabled={
                !this.state.taskChannelUpdates ||
                !this.state.selectedWorker ||
                hasUpdates(taskChannelUpdates)
              }
            >
              SAVE
            </Flex.Button>
            <Flex.Button
              className={classes.resetButton}
              onClick={this.handleClearFilters}
            >
              RESET
            </Flex.Button>
          </div>
        </div>
      </>
    );
  }
}

export default connect()(withStyles(styles)(CapacityManager));
