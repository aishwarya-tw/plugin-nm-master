import React, { Component, Fragment } from 'react';
import clsx from 'clsx';

import {
  Grid,
  Typography,
  Switch,
  withStyles,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  // Divider,
  Select,
  MenuItem,
  FilledInput,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
  // Checkbox
} from '@material-ui/core';
import { HelpOutline as QuestionIcon } from '@material-ui/icons';
import { CheckCircle as ActiveSettingIcon } from '@material-ui/icons';
import styles from './styles';
import QuickHelp from './QuickHelp/QuickHelp';

// TODO: This will be triggered from a universal config flag the plugin.
const showCallbacks = true;

const initialConfig = {
  callbacksEnabled: false,
  announcementsEnabled: false,
  type: 'simple',
  queueDepth: 0,
  EWT: 0,
  positionConstraint: 5,
  taskRefreshIntervalInSeconds: 60,
  useTaskRouterStats: false
};

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

class DefaultConfiguration extends Component {
  state = {
    newConfiguration: { ...initialConfig },
    disableBtns: false
  };

  componentDidMount = () => {
    const { configuration } = this.props;

    // To force options, hard code an override.
    // e.g. { type: 'ewt' }
    const overrides = {};

    if (configuration) {
      this.setState({
        newConfiguration: {
          ...initialConfig,
          ...configuration,
          ...overrides
        }
      });
    }
  };

  componentDidUpdate = prevProps => {
    const oldConfig = prevProps.configuration;
    const { configuration: newConfig } = this.props;

    if (JSON.stringify(oldConfig) !== JSON.stringify(newConfig)) {
      let resetConfig = { ...initialConfig };
      if (newConfig !== undefined) {
        resetConfig = {
          ...initialConfig,
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
    newConfiguration[configItem] = e.target.value;

    this.setState({ newConfiguration });
  };

  handleSave = () => {
    const { newConfiguration } = this.state;

    const { handleSave } = this.props;
    this.setState({ disableBtns: true });

    handleSave(newConfiguration).finally(() =>
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
      newConfiguration,
      newConfiguration: { callbacksEnabled },
      disableBtns
    } = this.state;
    const { classes } = this.props;

    // const taskRefreshIntervalInSecondsError =
    //   newConfiguration.taskRefreshIntervalInSeconds !== '' &&
    //   (newConfiguration.messageRepeatSeconds < 60 ||
    //     newConfiguration.messageRepeatSeconds > 180);

    // const toggleAnnouncements = (
    //   <Switch
    //     classes={classes}
    //     checked={newConfiguration.announcementsEnabled}
    //     onChange={this.handleTypeChange('announcementsEnabled')}
    //     value="announcementsEnabled"
    //     color="primary"
    //   />
    // );

    const toggleCallbacks = (
      <Switch
        classes={classes}
        checked={newConfiguration.callbacksEnabled}
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

    // const DataRefresh = options => (
    //   <Fragment>
    //     <Label
    //       text="Refresh Call Data Every"
    //       tooltip="The minimum interval, in seconds, that data is refreshed for a queue."
    //       classes={classes}
    //     />

    //     <TextField
    //       disabled={options.disabled || false}
    //       variant="filled"
    //       type="number"
    //       value={newConfiguration.taskRefreshIntervalInSeconds}
    //       onChange={this.handleValueChange('taskRefreshIntervalInSeconds')}
    //       error={
    //         taskRefreshIntervalInSecondsError ||
    //         this.isEmpty('taskRefreshIntervalInSeconds')
    //       }
    //       helperText={taskRefreshIntervalInSecondsError ? null : null}
    //       inputProps={{
    //         className: classes.inputWithAdornment,
    //         min: '60',
    //         max: '9999'
    //       }}
    //       InputProps={{
    //         endAdornment: (
    //           <InputAdornment position="end">seconds</InputAdornment>
    //         )
    //       }}
    //       className={classes.helperInputLimit}
    //     />
    //   </Fragment>
    // );

    // const UseTaskRouterStats = options => (
    //   <Fragment>
    //     <Label
    //       text="Use TaskRouter Stats"
    //       tooltip={options.tooltip}
    //       classes={classes}
    //     />

    //     <Checkbox
    //       checked={newConfiguration.useTaskRouterStats}
    //       onChange={this.handleCheckedChange('useTaskRouterStats')}
    //       color="primary"
    //     />
    //   </Fragment>
    // );

    // const GlobalOptions = options => (
    //   <Grid item xs={12} className={classes.configItem}>
    //     <Divider className={classes.divider} />
    //     <Grid item xs={12} className={clsx(classes.configItem)}>
    //       <Grid container alignItems="center">
    //         {UseTaskRouterStats({
    //           tooltip:
    //             'Whether to use TaskRouter or call queues to fetch queue statistics.'
    //         })}
    //       </Grid>
    //       {newConfiguration.useTaskRouterStats && (
    //         <Grid item xs={12} className={classes.configItem}>
    //           <Grid container alignItems="center">
    //             {DataRefresh({})}
    //           </Grid>
    //         </Grid>
    //       )}
    //     </Grid>
    //   </Grid>
    // );

    return (
      <Grid container>
        <Grid item xs={12} className={classes.headerItem}>
          <Typography variant="h6">Default Configuration</Typography>
        </Grid>

        {/* <Grid item xs={12} className={classes.configItem}>
          <ExpansionPanel
            expanded={announcementsEnabled}
            className={classes.expansionPanel}
          >
            <ExpansionPanelSummary>
              <Grid container alignItems="center">
                <Label
                  text="Enable Announcements"
                  tooltip="Enable Voice Announcements by default"
                  classes={classes}
                />

                {toggleAnnouncements}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container alignItems="center">
                <Grid item xs={12} className={classes.configItem}>
                  <Grid container alignItems="center">
                    {TriggerType({
                      tooltip:
                        'Select the trigger type for the announcement. This will determine the conditions an announcement is made.'
                    })}
                  </Grid>
                </Grid>
                {newConfiguration.type === 'queue-depth' && (
                  <Grid
                    item
                    xs={12}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'queue-depth' &&
                        classes.disabled
                    )}
                  >
                    <Grid container alignItems="center">
                      {QueueDepth({
                        disabled: newConfiguration.type !== 'queue-depth',
                        tooltip:
                          'The minimum number of callers in a queue that will enable Announcement.'
                      })}
                    </Grid>
                  </Grid>
                )}
                {newConfiguration.type === 'ewt' && (
                  <Grid
                    item
                    xs={12}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'ewt' && classes.disabled
                    )}
                  >
                    <Grid container alignItems="center">
                      {WaitTime({
                        disabled: newConfiguration.type !== 'ewt',
                        tooltip:
                          'The Estimated Wait Time, in seconds, that Callback will be enabled for a queue.'
                      })}
                    </Grid>
                  </Grid>
                )}
                {newConfiguration.type === 'queue-depth' && (
                  <Grid
                    item
                    xs={12}
                    className={clsx(
                      classes.configItem,
                      newConfiguration.type !== 'queue-depth' &&
                        classes.disabled
                    )}
                  >
                    <Grid container alignItems="center">
                      {StopCondition({
                        disabled: newConfiguration.type !== 'queue-depth',
                        tooltip:
                          'When caller reaches this position in queue or higher, announcements will no longer be played'
                      })}
                    </Grid>
                  </Grid>
                )}
                {newConfiguration.type !== 'simple' && <GlobalOptions />}
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
                    tooltip="Enable Voice Callbacks by default"
                    classes={classes}
                  />

                  {toggleCallbacks}
                </Grid>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container alignItems="center">
                  <Grid item xs={12} className={classes.configItem}>
                    <Grid container alignItems="center">
                      {TriggerType({
                        tooltip:
                          'Select the trigger type for the callback. This will determine the conditions a callback offer is made.'
                      })}
                    </Grid>
                  </Grid>
                  {newConfiguration.type === 'queue-depth' && (
                    <Grid
                      item
                      xs={12}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'queue-depth' &&
                          classes.disabled
                      )}
                    >
                      <Grid container alignItems="center">
                        {QueueDepth({
                          disabled: newConfiguration.type !== 'queue-depth',
                          tooltip:
                            'The minimum number of callers in a queue that will enable Callback.'
                        })}
                      </Grid>
                    </Grid>
                  )}
                  {newConfiguration.type === 'ewt' && (
                    <Grid
                      item
                      xs={12}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'ewt' && classes.disabled
                      )}
                    >
                      <Grid container alignItems="center">
                        {WaitTime({
                          disabled: newConfiguration.type !== 'ewt',
                          tooltip:
                            'The Estimated Wait Time, in seconds, that Callback will be enabled for a queue.'
                        })}
                      </Grid>
                    </Grid>
                  )}
                  {newConfiguration.type === 'queue-depth' && (
                    <Grid
                      item
                      xs={12}
                      className={clsx(
                        classes.configItem,
                        newConfiguration.type !== 'queue-depth' &&
                          classes.disabled
                      )}
                    >
                      <Grid container alignItems="center">
                        {StopCondition({
                          disabled: newConfiguration.type !== 'queue-depth',
                          tooltip:
                            'When caller reaches this position in queue or higher, callback will no longer be offered.'
                        })}
                      </Grid>
                    </Grid>
                  )}
                  {/* {newConfiguration.type !== 'simple' && <GlobalOptions />} */}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        )}

        <Grid container item xs={6} className={classes.btnItem}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSave}
            className={classes.saveBtn}
            disabled={disableBtns || this.isEmpty()}
          >
            Save
          </Button>

          {disableBtns && <CircularProgress color="secondary" size={32} />}
        </Grid>

        <Grid
          container
          item
          xs={6}
          justify="flex-end"
          direction="row"
          alignItems="center"
          className={classes.btnItem}
        >
          <Typography
            variant="subtitle1"
            className={classes.label}
            align="right"
          >
            Quick Help
          </Typography>
          <QuickHelp />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DefaultConfiguration);
