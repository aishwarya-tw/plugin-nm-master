import React, { Component } from 'react';
import axios from 'axios';
import { Notifications, Manager } from '@twilio/flex-ui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { REDUX_NAMESPACE } from '../../utils/constants';

import { Actions } from '../../states/CallbacksReducer';
// import PerficientLogo from './logo/PerficientLogo';
// import PerficientTrapezoid from './logo/PerficientTrapezoid';

import {
  Grid,
  withStyles,
  MuiThemeProvider,
  CircularProgress,
  Typography
} from '@material-ui/core';
import styles from './styles';

import DefaultConfiguration from '../DefaultConfiguration';
import QueuesTable from '../QueuesTable';

const manager = Manager.getInstance();

const showCallbacks = true;

class ConfigurationView extends Component {
  constructor(props) {
    super(props);
    this.endpointUrl = manager.serviceConfiguration.attributes.NMG.awsEndpoint;
    // this.endpointUrl = 'http://e27b0e00d2c5.ngrok.io/dev/';

    //   manager.serviceConfiguration.attributes.runtimes['product-callbacks'];
    this.token = manager.store.getState().flex.session.ssoTokenPayload.token;
  }
  state = {
    loading: true
  };

  componentDidMount = () => {
    const { defaultConfig } =
      this.props && this.props.defaultConfig ? this.props.defaultConfig : {};

    if (!defaultConfig) {
      this.fetchConfigs();
    } else {
      this.setState({ loading: false });
    }
  };

  fetchConfigs = () => {
    this.setState({ loading: true });
    const endpoint = `${this.endpointUrl}get-configs?token=${this.token}`;
    axios
      .get(endpoint)
      .then(result => {
        const { defaultConfig, queues } = result.data.message.configs;

        const { setConfig } = this.props;
        setConfig(defaultConfig, queues);
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        Notifications.showNotification('get-configs error');
      });
  };

  handleShowDisabled = () => {
    const { showDisabled, setDisabled } = this.props;

    if (showDisabled) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  handleSave = (newConfiguration, queueSid) => {
    const { defaultConfig, queues, setConfig } = this.props;

    let nonEmptyNewConfig = { ...newConfiguration };
    delete nonEmptyNewConfig.announcementsEnabled; // not needed for this implementation

    if (
      queueSid &&
      nonEmptyNewConfig &&
      nonEmptyNewConfig.queues &&
      nonEmptyNewConfig.queues[queueSid] &&
      nonEmptyNewConfig.queues[queueSid].config &&
      Object.hasOwnProperty.call(
        nonEmptyNewConfig.queues[queueSid].config, // prevent circular reference/stack overflow
        'queues'
      )
    ) {
      delete nonEmptyNewConfig.queues[queueSid].config.queues;
    }

    const endpoint = `${this.endpointUrl}update-config`;

    return axios
      .post(endpoint, {
        token: this.token,
        queueSid,
        ...nonEmptyNewConfig
      })
      .then(() => {
        Notifications.showNotification('config-save-success');
        let newdefault = { ...defaultConfig };
        let newQueues = { ...queues };

        if (queueSid) {
          newQueues[queueSid].config = {
            ...nonEmptyNewConfig
          };
        } else {
          newdefault = { ...nonEmptyNewConfig };
        }

        setConfig(newdefault, newQueues);
        return;
      })
      .catch(error => {
        console.log('error updating config', error);
        Notifications.showNotification('config-save-error');
        return;
      });
  };

  handleDelete = queueSid => {
    const { defaultConfig, queues, setConfig } = this.props;

    const endpoint = `${this.endpointUrl}delete-configs`;
    return axios
      .post(endpoint, { token: this.token, queueSid })
      .then(() => {
        Notifications.showNotification('config-delete-success');

        let newQueues = { ...queues };
        delete newQueues[queueSid].config;
        setConfig(defaultConfig, newQueues);
      })
      .catch(() => {
        Notifications.showNotification('config-delete-error');
      });
  };

  render() {
    const { loading } = this.state;
    const { classes, queues, showDisabled, defaultConfig } = this.props;

    let content;
    if (loading) {
      content = (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.container}
        >
          <CircularProgress />
        </Grid>
      );
    } else {
      content = (
        <Grid container className={classes.container}>
          <Grid container alignItems="center" className={classes.brandBar}>
            <Typography variant="h5" className={classes.brandBarFont}>
              {showCallbacks && 'Voice Callbacks'}

              {!showCallbacks && 'Announcements'}
            </Typography>
            {/* <PerficientTrapezoid className={classes.brandBarTrapezoid} />
            <PerficientLogo className={classes.logo} /> */}
          </Grid>
          <Grid
            container
            item
            xs={12}
            alignItems="center"
            className={classes.containerInner}
          >
            <Grid item xs={5} className={classes.defaultItem}>
              <DefaultConfiguration
                configuration={defaultConfig}
                handleSave={this.handleSave}
              />
            </Grid>
            <Grid item xs={7} className={classes.queuesItem}>
              <QueuesTable
                queues={queues}
                showDisabled={showDisabled}
                handleSave={this.handleSave}
                handleDelete={this.handleDelete}
                handleShowDisabled={this.handleShowDisabled}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return <MuiThemeProvider>{content}</MuiThemeProvider>;
  }
}

const mapStateToProps = state => ({
  defaultConfig: state[REDUX_NAMESPACE].callbacks.defaultConfig,
  queues: state[REDUX_NAMESPACE].callbacks.queues,
  showDisabled: state[REDUX_NAMESPACE].callbacks.showDisabled
});

const mapDispatchToProps = dispatch => ({
  setConfig: bindActionCreators(Actions.setConfig, dispatch),
  setDisabled: bindActionCreators(Actions.showDisabled, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ConfigurationView));
