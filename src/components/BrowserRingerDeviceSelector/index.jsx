import React from 'react';
import { Notifications } from '@twilio/flex-ui';

class Ringer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { devices: [], ringer: null };
    this.handleRingerChange = this.handleRingerChange.bind(this);
    this.saveDevice = this.saveDevice.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  displayOutputs() {
    return this.state.devices.map((device, index) => (
      <option key={`output${index}`} value={device.label}>
        {device.label}
      </option>
    ));
  }

  async getDevices() {
    const currentDevices = await navigator.mediaDevices.enumerateDevices();
    if (currentDevices.length > 0) {
      let outputDevices = currentDevices.filter(device =>
        device.kind.match(/(\w+)(output)/i)
      );
      if (outputDevices.length > 0) {
        //remove default device
        outputDevices = outputDevices.filter(
          device => device.deviceId !== 'default'
        );
        this.setState({
          ringer: outputDevices[0].label
        });
      }
      return outputDevices;
    }
    return false;
  }

  async requestAudioAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks()[0].stop();
      return true;
    } catch (err) {
      return false;
    }
  }

  async componentDidMount() {
    const granted = await this.requestAudioAccess();
    if (granted) {
      const outputDevices = await this.getDevices();
      if (outputDevices) {
        this.setState({
          devices: outputDevices
        });
      } else {
        console.log('No audio devices were found');
        Notifications.dismissNotificationById('SetRingerWarning');
      }
    } else {
      console.log(
        'This user has blocked audio and will not be able to hear notifications.'
      );
      Notifications.dismissNotificationById('SetRingerWarning');
    }
  }

  async handleRingerChange(event) {
    this.setState({ ringer: event.target.value });
  }

  async saveDevice() {
    const { updateChoice } = this.props;
    if (this.state.ringer) {
      try {
        const chosenDevice = this.state.ringer;
        const device = this.state.devices.find(
          device => device.label === chosenDevice
        );
        localStorage.setItem('RingerDeviceId', device.deviceId);
        Notifications.dismissNotificationById('SetRingerWarning');
        if (updateChoice) {
          updateChoice();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  render() {
    return (
      <div>
        <div id="audioList" />
        {this.state.devices !== undefined && this.state.devices.length > 0 && (
          <div>
            <select
              value={this.state.ringer}
              onChange={this.handleRingerChange}
            >
              {this.displayOutputs()}
            </select>
            <button type="button" onClick={() => this.saveDevice()}>
              Save
            </button>
            {/* TODO: Save on select, remove save button */}
          </div>
        )}
      </div>
    );
  }
}

export default Ringer;
