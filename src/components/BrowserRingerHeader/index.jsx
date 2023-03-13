import * as React from 'react';
import Ringer from '../BrowserRingerDeviceSelector';
import Muter from '../BrowserRingerMuter';
import { VolumeUp } from '@material-ui/icons/index';
import { withStyles, Tooltip } from '@material-ui/core';
import styles from './styles';

class SetRingerHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showDevicePicker: false, audioEnabled: false };
    this.showDevicePicker = this.showDevicePicker.bind(this);
  }
  async requestAudioAccess() {
    try {
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          // this kills the new stream and the record icon in the tab
          stream.getTracks()[0].stop();
        });
      return true;
    } catch (err) {
      return false;
    }
  }

  async componentDidMount() {
    if (navigator.getUserMedia) {
      const granted = await this.requestAudioAccess();
      if (granted) {
        this.setState({
          audioEnabled: true
        });
      }
    }
  }

  showDevicePicker() {
    this.setState({ showDevicePicker: !this.state.showDevicePicker });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.devicePickerStyles}>
        {this.state.showDevicePicker && (
          <>
          <div>
            <Ringer updateChoice={this.showDevicePicker} />
            <Muter />
          </div>
          </>
        )}
        {!this.state.showDevicePicker && this.state.audioEnabled && (
          <Tooltip title="Manage Alert Sounds">
            <VolumeUp
              onClick={this.showDevicePicker}
              className={classes.volumeIcon}
            />
          </Tooltip>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(SetRingerHeader);
