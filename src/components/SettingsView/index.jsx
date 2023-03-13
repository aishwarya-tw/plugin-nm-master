import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { Grid, withStyles, Paper } from '@material-ui/core';

import {
  UPDATED_TRAFFIC_DISTRIBUTION_ERROR,
  UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS,
  GET_TRAFFIC_DISTRIBUTION_ERROR,
  TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID
} from '../../utils/constants';

import styles from './styles';
import Resource from '../../utils/resource';
import BPOSettings from './BPOSettings';
import SDASettings from './SDASettings';
import NMButton from '../NMButton';
import StaffMetrics from './StaffMetrics';
// import AllQueuesMetrics from './AllQueuesMetrics';

const ORIGINAL_BPO_PROVIDERS = [
  { name: 'Alorica', weight: '-' },
  { name: 'Arise', weight: '-' },
  { name: 'Internal', weight: '-' },
  { name: 'Telus', weight: '-' },
  { name: 'Qualfon', weight: '-' },
  { name: 'CCI', weight: '-' }
];

const ORIGINAL_SDA_PROVIDERS = [
  { name: 'Alorica SDA', weight: '-' },
  { name: 'Arise SDA', weight: '-' },
  { name: 'Internal SDA', weight: '-' },
  { name: 'Qualfon SDA', weight: '-'},
  { name: 'CCI SDA', weight: '-'}
];

//this must agree with getBpoResetWeights() in aws\src\common\bpo-routing\update-provider-weights\index.js
const DEFAULT_BPO_PROVIDERS = [
  { name: 'Alorica', weight: 25 },
  { name: 'Arise', weight: 25 },
  { name: 'Internal', weight: 25 },
  { name: 'Telus', weight: 25 },
  { name: 'Qualfon', weight: 0 },
  { name: 'CCI', weight: 0 }
];

const DEFAULT_SDA_PROVIDERS = [
  { name: 'Alorica SDA', weight: 34},
  { name: 'Arise SDA', weight: 33 },
  { name: 'Internal SDA', weight: 33 },
  { name: 'Qualfon SDA', weight: 0},
  { name: 'CCI SDA', weight: 0}
];

const BpoWeights = Resource('provider-weights');
class SettingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bpoProviders: ORIGINAL_BPO_PROVIDERS,
      sdaProviders: ORIGINAL_SDA_PROVIDERS,
      areBpoWeightsValid: true,
      areSdaWeightsValid: true
    };
  }

  componentDidMount = async () => {
    await this.getTrafficWeights();
  };

  componentDidUpdate() {
    if (!this.state.areBpoWeightsValid || !this.state.areSdaWeightsValid) {
      Flex.Notifications.dismissNotificationById(
        TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID
      );
      Flex.Notifications.showNotification(
        TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID
      );
    } else if (this.state.areBpoWeightsValid && this.state.areSdaWeightsValid) {
      Flex.Notifications.dismissNotificationById(
        TRAFFIC_DISTRIBUTION_WEIGHTS_NOT_VALID
      );
    }
  }

  getTrafficWeights = async () => {
    try {
      const response = await BpoWeights.read();
      const { message } = response;
      const { bpo = [], sda = [] } = message;

      this.setState({
        bpoProviders: bpo,
        sdaProviders: sda
      });
    } catch (error) {
      console.log('error', error);
      Flex.Notifications.showNotification(GET_TRAFFIC_DISTRIBUTION_ERROR);
    }
  };

  handleSave = async () => {
    try {
      const response = await BpoWeights.create({
        bpoProviders: this.state.bpoProviders,
        sdaProviders: this.state.sdaProviders
      });

      // if successfully updated re-pull from database
      if (response && response.message && response.message.success) {
        this.getTrafficWeights();
        Flex.Notifications.showNotification(
          UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS
        );
      }
    } catch (error) {
      console.log('Error updating weights in database', error);
      Flex.Notifications.showNotification(UPDATED_TRAFFIC_DISTRIBUTION_ERROR);
    }
  };

  handleBpoChange = e => {
    const bpoIndex = this.state.bpoProviders.findIndex(
      bpo => bpo.name === e.target.name
    );

    let newArray = [...this.state.bpoProviders];
    newArray[bpoIndex] = {
      ...newArray[bpoIndex],
      weight: Number(e.target.value)
    };

    // check total sum of all weights entered
    let totalWeight = newArray.reduce((n, { weight }) => n + weight, 0);

    this.setState({
      bpoProviders: newArray,
      areBpoWeightsValid: totalWeight === 100 ? true : false
    });
  };

  handleSdaChange = e => {
    const sdaIndex = this.state.sdaProviders.findIndex(
      sda => sda.name === e.target.name
    );

    let newArray = [...this.state.sdaProviders];
    newArray[sdaIndex] = {
      ...newArray[sdaIndex],
      weight: Number(e.target.value)
    };

    // check total sum of all weights entered
    let totalWeight = newArray.reduce((n, { weight }) => n + weight, 0);

    this.setState({
      sdaProviders: newArray,
      areSdaWeightsValid: totalWeight === 100 ? true : false
    });
  };

  handleReset = async () => {
    const response = await BpoWeights.create({
        bpoProviders: DEFAULT_BPO_PROVIDERS,
        sdaProviders: DEFAULT_SDA_PROVIDERS
      });
    if (response && response.message && response.message.success) {
        this.getTrafficWeights();
        Flex.Notifications.showNotification(
          UPDATED_TRAFFIC_DISTRIBUTION_SUCCESS
        );
      } 
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid className={classes.root}>
        <Grid 
            container
            alignItems="flex-start"
            direction="row"
            justify="flex-start">
          <Paper>
                <BPOSettings
                  bpoProviders={this.state.bpoProviders}
                  handleBpoChange={this.handleBpoChange}
                />
                <SDASettings
                  sdaProviders={this.state.sdaProviders}
                  handleSdaChange={this.handleSdaChange}
                />
                <Grid container alignItems="center">
                  <NMButton
                    onClick={this.handleSave}
                    disabled={
                      !this.state.areBpoWeightsValid || !this.state.areSdaWeightsValid
                    }
                    variant="blue"
                    color="primary"
                    className={classes.button}
                  >
                    Save
                  </NMButton>
                  <NMButton
                    variant="red"
                    onClick={this.handleReset}
                    className={classes.button}
                  >
                    Reset
                  </NMButton>
                </Grid>
          </Paper>
          <StaffMetrics />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SettingsView);