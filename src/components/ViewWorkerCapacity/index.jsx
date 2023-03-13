import React from 'react';
import { Typography, CircularProgress, withStyles } from '@material-ui/core';

import ToolHeader from '../ToolContainer/Header';
import styles from './styles';
import Resource from '../../utils/resource';
import Channel from './Channel';

const GetWorkerChannelList = Resource('get-worker-channels-list');

class ViewWorkerCapacity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selectedWorker: null,
      taskChannels: []
    }
  }

  componentDidMount() {
    this.getWorkerChannels();
  }

  componentDidUpdate(prevProps, prevState) {
    const { sid: workerSid } = this.props.worker;
    if (
      prevProps.worker.sid &&
      workerSid &&
      workerSid !== prevProps.worker.sid
    ) {
      this.getWorkerChannels();
    }
  }

  getWorkerChannels() {
    const { sid: workerSid } = this.props.worker;

    this.setState({ loading: true });

    GetWorkerChannelList.read({ workerSid })
      .then(result => {
        this.mapWorkerChannelInfo(result);
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }
  
  mapWorkerChannelInfo(result) {
    const mapping = [];

    result.message.channels.forEach(channel => {
      mapping.push({
        taskChannelUniqueName: channel.taskChannelUniqueName,
        configuredCapacity: channel.configuredCapacity
      });
    });

    this.setState({
      taskChannels: mapping
    });
  }

  render() {
    const { classes } = this.props;
    const { loading, taskChannels } = this.state;

    return (
      <>
        <ToolHeader
          label={
            <div>
              <Typography variant="h6" className={classes.toolLabel}>
                Worker Channel Capacity
              </Typography>
            </div>
          }
        />
        <div style={{marginLeft: 12, marginRight: 12, marginBottom: 12}}>
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
          {!loading && (
            <ul>
              {taskChannels.map(channel => (
                <Channel key={channel.taskChannelUniqueName} channel={channel} />
              ))}
            </ul>
          )}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(ViewWorkerCapacity);