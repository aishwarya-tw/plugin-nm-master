import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';
import {
  REDUX_NAMESPACE,
  BACKEND_ERROR_NOTIFICATION
} from '../../utils/constants';

import { Grid, Typography, Link, withStyles } from '@material-ui/core';
import styles from './styles';

import NMInput from '../NMInput';
import NMButton from '../NMButton';
import Status from './Status';
import Events from './Events';

import USPSIcon from '../../assets/USPSIcon';
import ExternalLinkIcon from '../../assets/ExternalLinkIcon';

import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';
import ToolScrollable from '../ToolContainer/Scrollable';

import Resource from '../../utils/resource';
const USPSTrackingResource = Resource('usps-tracking');

class USPSTracking extends Component {
  fetchTrackingInfo = () => {
    const { task, toolName, toolState, setToolState } = this.props;

    const newToolState = { ...toolState, loading: true };
    setToolState(task.taskSid, toolName, newToolState);

    
    USPSTrackingResource.read({ trackingNo: toolState.trackingNo })
      .then(data => {
        let newToolState = {
          ...toolState,
          loading: false,
          friendlyErrorMessage: undefined,
          trackingInfo: undefined
        };

        if (data.friendlyErrorMessage) {
          newToolState.friendlyErrorMessage = data.friendlyErrorMessage;
        } else {
          newToolState.trackingInfo = data.trackingInfo;
        }

        setToolState(task.taskSid, toolName, newToolState);
      })
      .catch(error => {
        console.log(error);
        const errorMessage = 'Could not access USPS data.';
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
      });
  };

  handleTrackingNoChange = e => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    const newState = { ...toolState, trackingNo: e.target.value };
    setToolState(taskSid, toolName, newState);
  };

  render() {
    const { classes, taskSid, toolState } = this.props;
    const { trackingNo, trackingInfo, loading, friendlyErrorMessage } =
      toolState || {};
    const { events, estimatedDelivery, from, service, status, to, uniqueId } =
      trackingInfo || {};

    const { attributes } = Flex.Manager.getInstance().serviceConfiguration;
    let externalLink = attributes.NMG.USPSTrackingUrl;
    if (trackingNo) {
      externalLink = `${externalLink}?tLabels=${trackingNo}`;
    }

    return (
      <ToolContent taskSid={taskSid}>
        <ToolHeader
          label={
            <Grid container>
              <USPSIcon variant="blue" className={classes.headerUSPSIcon} />
              <Typography variant="h5" className={classes.headerTrackingText}>
                Tracking
              </Typography>
            </Grid>
          }
          secondaryAction={
            <Grid container alignItems="center" justify="flex-end">
              <ExternalLinkIcon
                variant="blue"
                className={classes.headerExternalIcon}
              />
              <Link
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.headerExternalLink}
              >
                Launch in new tab
              </Link>
            </Grid>
          }
          input={
            <Grid container alignItems="center" item xs={12}>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  className={classes.headerSearchText}
                >
                  Enter customer Tracking ID below for shipment status.
                </Typography>
              </Grid>

              <Grid container item xs={12}>
                <NMInput
                  value={trackingNo}
                  variant="white"
                  onChange={this.handleTrackingNoChange}
                  className={classes.headerSearchInput}
                />
                <NMButton
                  onClick={this.fetchTrackingInfo}
                  className={classes.headerSearchBtn}
                  disabled={!trackingNo || trackingNo === ''}
                >
                  TRACK
                </NMButton>
              </Grid>
            </Grid>
          }
          loading={loading}
        />

        {friendlyErrorMessage && (
          <Grid container justify="center" item xs={12}>
            <Typography
              variant="body1"
              className={classes.errorMessage}
              align="center"
            >
              {friendlyErrorMessage}
            </Typography>
          </Grid>
        )}

        {trackingInfo && (
          <>
            <Status
              key={uniqueId}
              estimatedDelivery={estimatedDelivery}
              from={from}
              service={service}
              status={status}
              to={to}
              classes={classes}
            />

            <ToolScrollable scrollKey={`${taskSid}-usps`}>
              <Events events={events} classes={classes} />
            </ToolScrollable>
          </>
        )}
      </ToolContent>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  toolState: state[REDUX_NAMESPACE].tools[ownProps.taskSid][ownProps.toolName]
});

const mapDispatchToProps = dispatch => ({
  setToolState: bindActionCreators(Actions.setToolState, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(USPSTracking));
