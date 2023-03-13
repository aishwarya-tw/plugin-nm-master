import React, { Component } from 'react';
import { SideLink, Actions, Icon } from '@twilio/flex-ui';

class ConfigurationSidebarButton extends Component {
  navigate = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: 'callbacks-config'
    });
  };

  render() {
    const { activeView } = this.props;
    return (
      <SideLink
        showLabel={true}
        icon={<Icon icon="Hangup" />}
        iconActive={<Icon icon="HangupBold" />}
        isActive={activeView === 'callbacks-config'}
        onClick={this.navigate}
      >
        Callbacks Config
      </SideLink>
    );
  }
}

export default ConfigurationSidebarButton;
