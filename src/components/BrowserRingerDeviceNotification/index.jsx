import * as React from 'react';
import BrowserRingerDeviceSelector from '../BrowserRingerDeviceSelector';

class BrowserRingerNotification extends React.PureComponent {
  render() {
    const { notificationContext } = this.props;
    return (
      <div>
        {notificationContext.message}
        <div />
        {<BrowserRingerDeviceSelector />}
      </div>
    );
  }
}
export default BrowserRingerNotification;
