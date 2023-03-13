import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

const SettingsIconButton = ({ activeView }) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'settings-viewer' });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Settings"
      iconActive="SettingsBold"
      isActive={activeView === 'settings-viewer'}
      onClick={navigate}
    >
      {' '}
      Settings
    </SideLink>
  );
};

export default SettingsIconButton;
