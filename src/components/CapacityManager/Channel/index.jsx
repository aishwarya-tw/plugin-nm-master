import React from 'react';
import styles from './styles';
import { Grid, withStyles, Input, InputLabel } from '@material-ui/core';

class WorkerChannel extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  renderWorkerTaskChannelList() {
    const {
      selectedWorkerTaskChannels,
      handleCapacityChange,
      classes,
      taskChannelUpdates,
      setInputRef,
      placeHolderChannelUpdates
    } = this.props;

    console.log(
      'CAP taskChannelUpdates inside Channel ' +
        JSON.stringify(taskChannelUpdates)
    );
    console.log(
      'CAP selectedWorkerTaskChannels inside Channel ' +
        JSON.stringify(selectedWorkerTaskChannels)
    );

    return selectedWorkerTaskChannels.map(channel => {
      return (
        <div>
          <InputLabel>{channel.taskChannelUniqueName}</InputLabel>
          <Input
            inputRef={ref => setInputRef(ref)}
            placeholder={
              placeHolderChannelUpdates &&
              placeHolderChannelUpdates[channel.taskChannelUniqueName] &&
              placeHolderChannelUpdates[channel.taskChannelUniqueName].newCapacity
                ? placeHolderChannelUpdates[channel.taskChannelUniqueName].newCapacity
                : channel.configuredCapacity
            }
            className={classes.capacityInput}
            name={channel.taskChannelUniqueName}
            fullWidth={true}
            onChange={event =>
              handleCapacityChange(
                channel,
                taskChannelUpdates &&
                  taskChannelUpdates[channel.taskChannelUniqueName] &&
                  taskChannelUpdates[channel.taskChannelUniqueName].newCapacity
                  ? taskChannelUpdates[channel.taskChannelUniqueName]
                      .newCapacity
                  : channel.configuredCapacity,
                event.target.value
              )
            }
            inputProps={{ maxLength: 1 }}
          />
        </div>
      );
    });
  }

  handleSelect(event) {
    const { getWorkerChannelList, worker } = this.props;
    getWorkerChannelList(worker);
  }

  render() {
    const { classes, selectedWorkerTaskChannels, selectedWorker } = this.props;

    return (
      <Grid
        container
        alignItems="center"
        item
        xs={12}
        className={classes.capacityContainer}
      >
        <Grid item xs={3} className={classes.capacityContainer}>
          {this.renderWorkerTaskChannelList(
            selectedWorkerTaskChannels,
            selectedWorker
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(WorkerChannel);
