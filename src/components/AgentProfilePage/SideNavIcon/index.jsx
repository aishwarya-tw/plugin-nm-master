import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

const AgentProfilePageSideNavButton = ({ activeView }) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'agent-profile-page' });
  }

  return (
    <SideLink
      showLabel={true}
      icon="DefaultAvatar"
      iconActive="DefaultAvatarBold"
      isActive={activeView === 'agent-profile-page'}
      onClick={navigate}
    >
      Agent Profile Page
    </SideLink>
  );
};

export default AgentProfilePageSideNavButton;