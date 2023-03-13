import React, { Component, Fragment } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { REDUX_NAMESPACE } from '../../utils/constants';

import {
  Grid,
  Typography,
  Switch,
  withStyles,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  FilledInput,
  Select,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';
import { HelpOutline as QuestionIcon } from '@material-ui/icons';
import { CheckCircle as ActiveSettingIcon } from '@material-ui/icons';
import styles from './styles';

// TODO: This will be triggered from a universal config flag the plugin.
const showCallbacks = true;

function Label(props) {
  const { text, tooltip, classes } = props;

  return (
    <Grid container alignItems="center" className={classes.labelContainer}>
      <Typography variant="subtitle1" className={classes.label} align="right">
        {text}
      </Typography>

      <Tooltip title={tooltip} className={classes.helpIcon}>
        <QuestionIcon />
      </Tooltip>
    </Grid>
  );
}

class QueueConfiguration extends Component {
  constructor(props) {
    super();
    const { configuration, defaultConfig } = props;

    // To force options, hard code an override.
    // e.g. { type: 'ewt' }
    const overrides = {};

    // Use the default configuration as the starting point.
    if (configuration) {
      this.state = {
        newConfiguration: {
          ...defaultConfig,
          ...configuration,
          ...overrides
        }
      };
    } else {
      this.state = {
        newConfiguration: { ...defaultConfig, ...overrides }
      };
    }
    this.state = { ...this.state, disableBtns: false };
  }

  componentDidUpdate = prevProps => {
    const oldConfig = prevProps.configuration;
    const { configuration: newConfig, defaultConfig } = this.props;

    if (oldConfig !== newConfig) {
      let resetConfig = { ...defaultConfig };

      if (newConfig !== undefined) {
        resetConfig = {
          ...defaultConfig,
          ...newConfig
        };
      }

      this.setState({
        newConfiguration: resetConfig
      });
    }
  };

  handleTypeChange = name => event => {
    const toggleState = event.target.checked;
    let {
      newConfiguration,
      newConfiguration: { announcementsEnabled, callbacksEnabled }
    } = this.state;

    // 3 Modes, announcements enabled; or callbacks enabled; or neither (disabled)
    switch (name) {
      case 'announcementsEnabled':
        announcementsEnabled = toggleState;
        callbacksEnabled = callbacksEnabled && !toggleState;
        break;

      case 'callbacksEnabled':
        callbacksEnabled = toggleState;
        announcementsEnabled = announcementsEnabled && !toggleState;
        break;

      default:
        break;
    }

    const configurationChanges = Object.assign({}, newConfiguration, {
      announcementsEnabled,
      callbacksEnabled
    });

    this.setState({
      newConfiguration: configurationChanges
    });
  };

  handleCheckedChange = configItem => e => {
    let { newConfiguration } = this.state;
    newConfiguration[configItem] = e.target.checked;

    this.setState({ newConfiguration });
  };

  handleValueChange = configItem => e => {
    let { newConfiguration } = this.state;

    // TODO: check if these value deletions are needed
    if (e.target.value === '') {
      delete newConfiguration[configItem];
    } else {
      newConfiguration[configItem] = e.target.value;
    }

    if (configItem === 'type') {
      // clear values if type is not matching
      if (e.target.value !== 'ewt') {
        newConfiguration.ewt = '';
      }

      if (e.target.value !== 'queue-depth') {
        newConfiguration.queueDepth = '';
      }
    }

    this.setState({ newConfiguration });
  };

  handleSaveConfig = () => {
    const { newConfiguration } = this.state;

    const { handleSave } = this.props;
    this.setState({ disableBtns: true });

    handleSave(newConfiguration);
    this.setState({ disableBtns: false });
  };

  handleDelete = () => {
    const { newConfiguration, handleDelete } = this.props;
    this.setState({ disableBtns: true });

    handleDelete(newConfiguration).finally(() =>
      this.setState({ disableBtns: false })
    );
  };

  isEmpty = configItem => {
    const { newConfiguration } = this.state;

    if (!configItem) {
      return Object.values(newConfiguration).some(item => item === '');
    }

    return newConfiguration[configItem] === '';
  };

  render() {
    const {
      newConfiguration = this.props.defaultConfig,
      newConfiguration: {
        // announcementsEnabled = false,
        callbacksEnabled = false
      },
      disableBtns
    } = this.state;

    const { classes } = this.props;

    // const toggleAnnouncements = (
    //   <Switch
    //     classes={classes}
    //     checked={announcementsEnabled}
    //     onChange={this.handleTypeChange('announcementsEnabled')}
    //     value="announcementsEnabled"
    //     color="primary"
    //   />
    // );

    const toggleCallbacks = (
      <Switch
        classes={classes}
        checked={callbacksEnabled}
        onChange={this.handleTypeChange('callbacksEnabled')}
        value="callbacksEnabled"
        color="primary"
      />
    );

    const TriggerType = options => (
      <Fragment>
        <Label text="Type" tooltip={options.tooltip || ''} classes={classes} />

        <Select
          value={newConfiguration.type}
          onChange={this.handleValueChange('type')}
          input={<FilledInput />}
          classes={classes}
        >
          <MenuItem className={classes.dropdownSelect} value="simple">
            Simple
          </MenuItem>
          <MenuItem className={classes.dropdownSelect} value="ewt">
            EWT
          </MenuItem>
          <MenuItem className={classes.dropdownSelect} value="queue-depth">
            Queue Depth
          </MenuItem>
        </Select>
      </Fragment>
    );

    const StopCondition = options => (
      <Fragment>
        <Label
          text="Stops at Queue Position"
          tooltip={options.tooltip}
          classes={classes}
        />

        <TextField
          variant="filled"
          type="number"
          value={newConfiguration.positionConstraint}
          error={this.isEmpty('positionConstraint')}
          onChange={this.handleValueChange('positionConstraint')}
          inputProps={{
            className: classes.input
          }}
        />
      </Fragment>
    );

    const QueueDepth = options => (
      <Fragment>
        <Label text="Queue Depth" tooltip={options.tooltip} classes={classes} />
        <TextField
          disabled={options.disabled || false}
          variant="filled"
          type="number"
          value={newConfiguration.queueDepth}
          error={this.isEmpty('queueDepth')}
          onChange={this.handleValueChange('queueDepth')}
          inputProps={{
            className:
              newConfiguration.type === 'queue-depth'
                ? classes.inputWithAdornmentIcon
                : classes.input
          }}
          InputProps={{
            endAdornment:
              newConfiguration.type === 'queue-depth' ? (
                <InputAdornment position="end">
                  <ActiveSettingIcon className={classes.inputIcon} />
                </InputAdornment>
              ) : (
                ''
              )
          }}
        />
      </Fragment>
    );

    const WaitTime = options => (
      <Fragment>
        <Label text="EWT" tooltip={options.tooltip || ''} classes={classes} />

        <TextField
          disabled={options.disabled || false}
          variant="filled"
          type="number"
          value={newConfiguration.EWT}
          error={this.isEmpty('EWT')}
          onChange={this.handleValueChange('EWT')}
          inputProps={{
            className:
              newConfiguration.type === 'ewt'
                ? classes.inputWithAdornmentIcon
                : classes.input
          }}
          InputProps={{
            endAdornment:
              newConfiguration.type === 'ewt' ? (
                <InputAdornment position="end">
                  <ActiveSettingIcon className={classes.inputIcon} />
                </InputAdornment>
              ) : (
                ''
              )
          }}
        />
      </Fragment>
    );

    return (
      <Grid container>
        {/* <Grid item xs={12} className={classes.configItem}>
          <ExpansionPanel
            expanded={announcementsEnabled}
            className={classes.expansionPanel}
          >
            <ExpansionPanelSummary>
              <Grid container alignItems="center">
                <Label
                  text="Enable Announcements"
                  tooltip="Enable Voice Announcements by for this queue"
                  classes={classes}
                  xs={12}
                />

                {toggleAnnouncements}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container justify="space-evenly" alignItems="center">
                <Grid container className={classes.configItem} xs={12} md={4}>
                  <Grid item alignItems="center">
                    {TriggerType({
                      tooltip:
                        'Select the trigger type for the announcement. This will determine the conditions an announcement is made.'
                    })}
                  </Grid>
                </Grid>
                {newConfiguration.type === 'ewt' && (
                  <Grid
                    container
                    xs={12}
                    md={4}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'ewt' && classes.disabled
                    )}
                  >
                    <Grid item alignItems="center">
                      {WaitTime({
                        disabled: newConfiguration.type !== 'ewt',
                        tooltip:
                          "The Estimated Wait Time, in seconds, that Callback will be enabled for a queue. Announcement Type 'EWT' needs to be selected for this to be active"
                      })}
                    </Grid>
                  </Grid>
                )}
                {newConfiguration.type === 'queue-depth' && (
                  <Grid
                    container
                    xs={12}
                    md={4}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'queue-depth' &&
                        classes.disabled
                    )}
                  >
                    <Grid item alignItems="center">
                      {QueueDepth({
                        disabled: newConfiguration.type !== 'queue-depth',
                        tooltip:
                          "The minimum number of callers in a queue that will enable Announcement. Announcement Type 'Queue Depth' needs to be selected for this to be active."
                      })}
                    </Grid>
                  </Grid>
                )}
                {newConfiguration.type === 'queue-depth' && (
                  <Grid
                    container
                    xs={12}
                    md={4}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'queue-depth' &&
                        classes.disabled
                    )}
                  >
                    <Grid item alignItems="center">
                      {StopCondition({
                        disabled: newConfiguration.type !== 'queue-depth',
                        tooltip:
                          'When caller reaches this position in queue or higher, announcements will no longer be played'
                      })}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid> */}

        {showCallbacks && (
          <Grid item xs={12} className={classes.configItem}>
            <ExpansionPanel
              expanded={callbacksEnabled}
              className={classes.expansionPanel}
            >
              <ExpansionPanelSummary>
                <Grid container alignItems="center">
                  <Label
                    text="Enable Callbacks"
                    tooltip="Enable Voice Callbacks for this queue"
                    classes={classes}
                  />
                  {toggleCallbacks}
                </Grid>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid
                  container
                  justify="space-evenly"
                  alignItems="center"
                  //xs={12}
                >
                  <Grid container xs={12} md={4} className={classes.configItem}>
                    <Grid item alignItems="center">
                      {TriggerType({
                        tooltip:
                          'Select the trigger type for the announcement. This will determine the conditions an announcement is made.'
                      })}
                    </Grid>
                  </Grid>
                  {newConfiguration.type === 'ewt' && (
                    <Grid
                      container
                      xs={12}
                      md={4}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'ewt' && classes.disabled
                      )}
                    >
                      <Grid item alignItems="center">
                        {WaitTime({
                          disabled: newConfiguration.type !== 'ewt',
                          tooltip:
                            "The Estimated Wait Time, in seconds, that Callback will be enabled for a queue. Announcement Type 'EWT' needs to be selected for this to be active"
                        })}
                      </Grid>
                    </Grid>
                  )}
                  {newConfiguration.type === 'queue-depth' && (
                    <Grid
                      container
                      xs={12}
                      md={4}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'queue-depth' &&
                          classes.disabled
                      )}
                    >
                      <Grid item alignItems="center">
                        {QueueDepth({
                          disabled: newConfiguration.type !== 'queue-depth',
                          tooltip:
                            "The minimum number of callers in a queue that will enable Announcement. Announcement Type 'Queue Depth' needs to be selected for this to be active."
                        })}
                      </Grid>
                    </Grid>
                  )}
                  {newConfiguration.type === 'queue-depth' && (
                    <Grid
                      container
                      xs={12}
                      md={4}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'queue-depth' &&
                          classes.disabled
                      )}
                    >
                      <Grid itemalignItems="center">
                        {StopCondition({
                          disabled: newConfiguration.type !== 'queue-depth',
                          tooltip:
                            'When caller reaches this position in queue or higher, announcements will no longer be played'
                        })}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        )}

        <Grid
          container
          alignItems="center"
          item
          xs={6}
          className={classes.btnItem}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSaveConfig}
            className={classes.saveBtn}
            disabled={disableBtns || newConfiguration.messageRepeatSecondsError}
          >
            Save
          </Button>

          {newConfiguration && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleDelete}
              className={classes.resetBtn}
              disabled={disableBtns}
            >
              Reset
            </Button>
          )}

          {disableBtns && <CircularProgress color="secondary" size={32} />}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  defaultConfig: state[REDUX_NAMESPACE].callbacks
});

export default connect(mapStateToProps)(withStyles(styles)(QueueConfiguration));
