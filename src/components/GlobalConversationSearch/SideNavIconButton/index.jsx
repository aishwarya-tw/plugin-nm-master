import React from 'react';
import { SideLink,Actions } from '@twilio/flex-ui';

const SideNavIconButton = ({activeView}) =>{
    function navigate(){
      Actions.invokeAction('NavigateToView', {viewName: 'global-search'});
    }
    
    return(
     <SideLink  
        showLabel = {true}
        icon = "Directory"
        iconActive = "DirectoryBold"
        isActive = {activeView === 'global-search'}
        onClick = {navigate}
        > Global Conversation Search</SideLink>

    );
};

export default SideNavIconButton;