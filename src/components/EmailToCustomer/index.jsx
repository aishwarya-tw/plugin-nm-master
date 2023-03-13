import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import {
  BACKEND_ERROR_NOTIFICATION,
} from '../../utils/constants';
import Resource from '../../utils/resource';
import NMSelect from '../NMSelect';
import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';
import clsx from 'clsx';
import {
  Typography,
  MenuItem,
  withStyles
} from '@material-ui/core';

import styles from './styles';
import NMInput from '../NMInput';
import NMButton from '../NMButton';
const CreateChannelAndTaskSid = Resource('send-outbound-email');
const manager = Flex.Manager.getInstance();
const initialFilters = {
  brand: 'None',
  subject: 'Enter Subject',
  customerEmail: 'Enter a Valid Customer Email'
};
class EmailToCustomer extends Component {
  constructor(props) {
    super(props);    
    this.state = { uploading: false, error: false, errorMessage: '', filters: initialFilters };
    this.inputRef = props.chatInputRef;
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange = filter => e => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        [filter]: e.target.value
      }
    });
  };
  
  checkSkillAvailability = (skills) => {
    let brand = this.state.filters.brand;    
    let isSkillAssignedAndNotDisabled = false;    
    skills.map(skill=>{      
      if((skill === 'NM Outbound Email' && brand === 'Neiman Marcus') ||
         (skill === 'BG Outbound Email' && brand === 'Bergdorf Goodman' )||
          (skill === 'HC Outbound Email' && brand === 'Horchow')) {          
            isSkillAssignedAndNotDisabled = true;
            return isSkillAssignedAndNotDisabled;
      }  
      return isSkillAssignedAndNotDisabled;
    });
    return isSkillAssignedAndNotDisabled;
  };

  handleSend = (filters) => {
    let workerSid = manager.workerClient.sid;
    
    let email = {
       from: {
          address: filters.customerEmail,
          name: filters.customerEmail
       },
      brand: filters.brand,
      subject: filters.subject,
      body: 'Agent Initiated Outbound Email',
      workerSid: workerSid
    }
  
    CreateChannelAndTaskSid.read( email )
     .then(data => {
      console.log('Succesfully created a new channel and task for Compose Email',data);
     })
     .catch(error => {
       console.log(error);
       const errorMessage = `Could not create ChatChannel Sid CHUB ${error}`;
       Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
         errorMessage
       });
     });
  };

  
  render() {    
    const { classes, taskSid} = this.props;
    let hasSkill = this.checkSkillAvailability(manager.workerClient.attributes.routing.skills);
    return (
      <div className={classes.root}>
        <ToolContent taskSid={taskSid}>      
      <div className={classes.container}>        
        <ToolHeader
          label={
            <Typography variant="h5" className={classes.label}>
              Send Email To Customer
            </Typography>
          }
          /> 
        <div className={classes.inputWrapper}>
          <NMSelect
              value={this.state.filters.brand}
              onChange={this.handleFilterChange('brand') }
              label="BRAND"
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Neiman Marcus">Neiman Marcus</MenuItem>
              <MenuItem value="Bergdorf Goodman">Bergdorf Goodman</MenuItem>
              <MenuItem value="Horchow">Horchow</MenuItem>
            </NMSelect>
        </div>
        <div className={clsx(classes.inputWrapper, classes.half)}>
            <NMInput
                type="TextField"
                value={this.state.filters.subject}
                onChange={this.handleFilterChange('subject')}
                label="SUBJECT"
                InputProps={{
                  className: classes.subject
                }}
                labelClassName={classes.textFieldInputLabel}
                className={classes.textFieldInputWrapper}
              />
        </div>
        <div className={clsx(classes.inputWrapper, classes.half)}>
          <NMInput
              type="TextField"
              value={this.state.filters.customerEmail}
              onChange={this.handleFilterChange('customerEmail')}
              label="CUSTOMER EMAIL"
              InputProps={{
                className: classes.customerEmail
              }}
              labelClassName={classes.textFieldInputLabel}
              className={classes.textFieldInputWrapper}
          />
        </div>
        <div className={classes.inputWrapper}>
          <NMButton
              onClick={() =>
                this.handleSend(this.state.filters)}
                disabled={
                  this.state.filters.brand === 'None' || 
                  this.state.filters.subject === 'Enter Subject' ||
                  this.state.filters.customerEmail === 'Enter a Valid Customer Email' ||
                  !hasSkill 
                }
            >
              Compose Email
          </NMButton>
        </div>      
      </div>
      </ToolContent>
      </div>      
    );
  }
}

export default withStyles(styles)(EmailToCustomer);
