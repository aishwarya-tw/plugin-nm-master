import React from 'react';
import { ReactComponent as StoreIcon } from './business_black_24dp.svg';
import { Actions, IconButton, TaskHelper, withTheme } from '@twilio/flex-ui';

class StoreTransferButton extends React.Component {
  handleClick = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'StoreTransferDialog',
      state: { isOpen: true }
    });
  }

  render() {
    const isLiveCall = TaskHelper.isLiveCall(this.props.task);

    return (
      <IconButton
        icon={<StoreIcon />}
        disabled={!isLiveCall}
        onClick={this.handleClick}
        themeOverride={this.props.theme.CallCanvas.Button}
        title="Transfer customer to store"
      />
    );
  }
}

export default withTheme(StoreTransferButton);