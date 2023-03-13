import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

const BulkSkillManagerSideNavButton = ({ activeView }) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: 'bulk-skill-manager' });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Supervisor"
      iconActive="SupervisorBold"
      isActive={activeView === 'bulk-skill-manager'}
      onClick={navigate}
    >
      Bulk Skill Manager
    </SideLink>
  );
};

export default BulkSkillManagerSideNavButton;
