import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  Input,
  Typography,
  InputLabel,
  List,
} from '@material-ui/core';
import styles from './styles';
import { connect } from 'react-redux';
import Resource from '../../../utils/resource';

const GetWorkerChannelList = Resource('get-worker-channels-list');

class BulkCapacityManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      capacitiesData: {
      //default: '',
      voice: '',
      chat: '',
      //video: '',
      sms: '',
      email: '',
      },
      workerTaskChannels: [],
    };
  }

  handleCapacityChange = (input) => (event) => {
    this.setState({...this.state,
      capacitiesData: {
        ...this.state.capacitiesData,
        [input]: event.target.value
      }})
  }

  mapWorkerChannelInformation(result, workerSid) {

    if (
      result.message &&
      Object.hasOwnProperty.call(result.message, 'channels') &&
      result.message.channels.length > 0
    ) {
      const newChannelMapping = [];
      result.message.channels.forEach(channel => {
        newChannelMapping.push({
          selectedWorker: workerSid,
          taskChannelUniqueName: channel.taskChannelUniqueName,
          sid: channel.sid,
          configuredCapacity: channel.configuredCapacity
        });
      });
      return newChannelMapping;
    }
    else {
      console.log('Could not retrieve worker Channel information');

    }

  }

  componentDidUpdate = (prevProps, prevState) => {

    if (prevProps.selection.length !== this.props.selection.length) {
      let workers;
      const { agents, selection } = this.props;
      let difference = selection.filter(agent => !prevProps.selection.includes(agent));
      workers = agents.filter(worker => difference.includes(worker.sid));
      workers.forEach(worker => {
        GetWorkerChannelList.read({ workerSid: worker.sid })
          .then(result => {
            const channelMapping = this.mapWorkerChannelInformation(result, worker.sid);
            this.setState({ workerTaskChannels: [...this.state.workerTaskChannels, channelMapping] });
          })
          .catch(error => {
            console.log(error);
          });
      })
    }

    const updatedCapacities = this.state;
    Object.keys(updatedCapacities.capacitiesData).forEach(key => {
      if (updatedCapacities.capacitiesData[key] === '') delete updatedCapacities.capacitiesData[key];
    });
    this.props.onCapacityChange(updatedCapacities);
  }


  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <List className={classes.bulkCapacityManagerList}>
        <Typography className={classes.bulkCapacityManagerTitle}>Capacity</Typography>
        
            <InputLabel htmlFor="ops-manager-select" className={classes.bulkCapacityManagerInputLabel}>Voice</InputLabel>
            <Input onChange={this.handleCapacityChange('voice')} value={this.state.capacitiesData.voice} className={classes.bulkCapacityManagerInput}></Input>
            
            <InputLabel htmlFor="bpo-provider-select" className={classes.bulkCapacityManagerInputLabel}>Chat</InputLabel>
            <Input onChange={this.handleCapacityChange('chat')} value={this.state.capacitiesData.chat} className={classes.bulkCapacityManagerInput}></Input>
            
            <InputLabel htmlFor="bpo-provider-select" className={classes.bulkCapacityManagerInputLabel}>SMS</InputLabel>
            <Input onChange={this.handleCapacityChange('sms')} value={this.state.capacitiesData.sms} className={classes.bulkCapacityManagerInput}></Input>
            
            <InputLabel htmlFor="bpo-provider-select" className={classes.bulkCapacityManagerInputLabel}>Email</InputLabel>
            <Input onChange={this.handleCapacityChange('email')} value={this.state.capacitiesData.email} className={classes.bulkCapacityManagerInput}></Input>
        </List>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  // teamManagers: state[REDUX_NAMESPACE].skillManager.filters.teamManager.data,
  // opsManagers: state[REDUX_NAMESPACE].skillManager.filters.opsManager.data,
  // bpoProviders: state[REDUX_NAMESPACE].skillManager.filters.bpoProvider.data,
  // attributes: state[REDUX_NAMESPACE].skillManager.attributeManager,
});

const mapDispatchToProps = (dispatch) => ({
  //updateAttributes: bindActionCreators(Actions.updateAttributes, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BulkCapacityManager));