import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import { simpleParser } from 'mailparser';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';
import {
  REDUX_NAMESPACE,
  BACKEND_ERROR_NOTIFICATION
} from '../../utils/constants';

import { Grid, Typography, MenuItem, withStyles } from '@material-ui/core';

import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';

import NMInput from '../NMInput';
import NMSelect from '../NMSelect';
import NMButton from '../NMButton';
import NMIconButton from '../NMIconButton';
import CloseIcon from '../../assets/CloseIcon';

import List from './List';
import Conversation from './Conversation';
import ProfileList from './ProfileList';
import SearchIndicator from './SearchIndicator';

import styles from './styles';

import Resource from '../../utils/resource';
import Item from './Item';
const CMDProfilesResource = Resource('cmd-profiles');
const CHUBConversationsList = Resource('get-chub-conversations-list');
const CHUBConversation = Resource('get-chub-conversation');

const initialFilters = {
  channel: 'All',
  dateRange: 'None',
  dateFrom: '',
  dateTo: ''
};
class CustomerHistory extends Component {
  componentDidMount = () => {
    const { toolState } = this.props;

    if (
      !toolState ||
      !(toolState.profiles && toolState.profiles.length > 0) ||
      !toolState.selectedProfile
    ) {
      this.getCustomerInfo();
    }
  };

  handleFilterChange = filter => e => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      filters: {
        ...toolState.filters,
        [filter]: e.target.value
      }
    });
  };

  getCustomerInfo = async () => {
    const { task, toolName, toolState, setToolState } = this.props;
    const { attributes } = task;
    attributes.findProfileInComHub = true;
    
    setToolState(task.taskSid, toolName, {
      ...toolState,
      loading: true,
      loadingMessage: 'Searching for profiles'
    });

    const self = this;
    let CMDResponse = null;
    const { cmdData } = this.props;

    if (Object.keys(cmdData).length !== 0) {
      console.log('In side CH if')
      const { cmdProfiles = [] } = cmdData[task._task.sid].data;

      let newToolState = {
        ...toolState,
        loading: false,
        filters: initialFilters
      };

      if (cmdProfiles.length === 0) {
        newToolState.selectedProfile = {
          phones: [attributes.phoneNum],
          emails: [attributes.emailAddr]
        };
      } else if (cmdProfiles.length === 1) {
        newToolState.selectedProfile = cmdProfiles[0];
      } else {
        newToolState.profiles = cmdProfiles;
      }

      await setToolState(task.taskSid, toolName, newToolState);
      if (newToolState.selectedProfile) {
        self.getChubConversationsList(newToolState.selectedProfile);
      }
    }
    else {
      CMDProfilesResource.create({ attributes })
        .then(data => {
          const { cmdProfiles = [] } = data;
          let newToolState = {
            ...toolState,
            loading: false,
            filters: initialFilters
          };

          // When no profiles or 1 profile is returned, automatically sets "selectedProfile"
          if (cmdProfiles.length === 0) {
            newToolState.selectedProfile = {
              phones: [attributes.phoneNum],
              emails: [attributes.emailAddr]
            };
          } else if (cmdProfiles.length === 1) {
            newToolState.selectedProfile = cmdProfiles[0];
          } else {
            newToolState.profiles = cmdProfiles;
          }

          setToolState(task.taskSid, toolName, newToolState);
          if (newToolState.selectedProfile) {
            self.getChubConversationsList(newToolState.selectedProfile);
          }
        })
        .catch(error => {
          console.log('Error retrieving CMD profiles', error);
          const errorMessage = `Could not retrieve profiles from CMD. ${error}`;
          Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
            errorMessage
          });
          setToolState(task.taskSid, toolName, {
            ...toolState,
            loading: false,
            loadingMessage: 'Fetching conversation details'
          });
        });

    }
  };

  getChubConversationsList = profile => {
    const { task, toolName, toolState, setToolState } = this.props;

    setToolState(task.taskSid, toolName, {
      ...toolState,
      loading: true,
      loadingMessage: 'Fetching conversations list'
    });

    const externalId = [...profile.emails, ...profile.phones];
    const { filters } = toolState;

    CHUBConversationsList.create({ externalId, filters })
      .then(data => {
        const { retrievedConversationsList = [] } = data;
        let newToolState = {
          ...toolState,
          conversations: retrievedConversationsList.map(conversation => {
            let tags;
            if (conversation.Tags && typeof conversation.Tags !== typeof {}) {
              tags = JSON.parse(conversation.Tags);
            } else {
              tags = conversation.Tags;
            }
            delete conversation.Tags;
            conversation = {
              ...conversation,
              ...tags
            };

            return conversation;
          }),
          selectedProfile: profile
        };

        setToolState(task.taskSid, toolName, newToolState);
      })
      .catch(error => {
        console.log(error);
        const errorMessage = `Could not retrieve conversations list from CHUB ${error}`;
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
        setToolState(task.taskSid, toolName, {
          ...toolState,
          loading: false,
          loadingMessage: 'Fetching conversation details'
        });
      });
  };

  parseEmail = email => {
    return simpleParser(email, {}, (err, parsed) => {
      if (err) {
        console.log(err);
      } else {
        return parsed;
      }
    });
  };

  handleViewConversation = conversation => {
    const { task, toolName, toolState, setToolState } = this.props;

    setToolState(task.taskSid, toolName, {
      ...toolState,
      loading: true,
      loadingMessage: 'Fetching conversation details'
    });

    CHUBConversation.read({ conversationId: conversation.ConversationId })
    .then(async (data) => {
        const { retrievedConversation } = data;
        let conversation = { ...retrievedConversation };

        const tags =
          conversation.Tags && typeof conversation.Tags !== typeof {}
            ? JSON.parse(conversation.Tags)
            : conversation.Tags;
        delete conversation.Tags;

        conversation = {
          ...conversation,
          ...tags
        };

        if (conversation.Messages[0].MessageType === 'EMAIL') {
          const messages = [];
          for (const message of conversation.Messages) {
            if (message && message.Preview && message.Preview !== undefined) {
              const result = await simpleParser(message.Preview);
              if(message.Direction === 'Inbound') {
                message.Preview = result.textAsHtml;
              }
              messages.push(message);
              if (
                messages &&
                messages.length === conversation.Messages.length
              ) {
                conversation.Messages = messages;

                let newToolState = {
                  ...toolState,
                  selectedConversation: conversation
                };

                setToolState(task.taskSid, toolName, newToolState);
              }
            }
          }
        } else {
          let newToolState = {
            ...toolState,
            selectedConversation: conversation
          };
          setToolState(task.taskSid, toolName, newToolState);
        }
      })
      .catch(error => {
        console.log(error);
        const errorMessage = 'Could not retrieve conversation from CHUB.';
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });

        setToolState(task.taskSid, toolName, {
          ...toolState,
          loading: false,
          loadingMessage: 'Fetching conversation details'
        });
      });
  };

  handleClearSelectedConversation = () => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      selectedConversation: undefined
    });
  };

  handleClearSelectedProfile = () => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    if (toolState.profiles && toolState.profiles.length > 1) {
      setToolState(taskSid, toolName, {
        ...toolState,
        selectedProfile: undefined
      });
    }
  };

  handleClearFilters = () => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      filters: initialFilters
    });
  };

  render() {
    const { task, toolState, taskSid, classes } = this.props;
    const { attributes } = task;

    const {
      profiles = [],
      loading,
      loadingMessage,
      conversations,
      selectedProfile,
      selectedConversation,
      filters = {}
    } = toolState || {};

    let customerName = '';

    if (
      selectedProfile &&
      (selectedProfile.firstName || selectedProfile.lastName)
    ) {
      if (selectedProfile.firstName) {
        customerName += selectedProfile.firstName;
      }

      if (selectedProfile.lastName) {
        if (selectedProfile.firstName) {
          customerName += ' ';
        }

        customerName += selectedProfile.lastName;
      }
    } else {
        if (attributes && (attributes.firstName || attributes.lastName)) {
          if (attributes.firstName) {
          customerName += attributes.firstName;
          }
        if (attributes.lastName) {
          if (attributes.firstName) {
            customerName += ' ';
          }
          customerName += attributes.lastName;
        }
      }
      else{
        console.log('Data in classes, Inside unknown',attributes.name)
          if(attributes && attributes.name){
            customerName = attributes.name;
        }
        else{
          customerName = "Unknown";
        }
      }
    }

    return (
      <ToolContent taskSid={taskSid}>
        {loading && <SearchIndicator message={loadingMessage} />}

        {!selectedProfile && (
          <ProfileList
            key={'profile-list'}
            profiles={profiles}
            getChubConversationsList={this.getChubConversationsList}
          />
        )}

        {selectedProfile && (
          <>
            <ToolHeader
              label={
                <div>
                  <Typography variant="h6" className={classes.toolLabel}>
                    Customer History
                  </Typography>

                  <Typography variant="h5" className={classes.customerName}>
                    {customerName}
                  </Typography>
                </div>
              }
              secondaryAction={
                !selectedConversation && (
                  <div className={classes.secondaryWrapper}>
                    {profiles && profiles.length > 1 && (
                      <NMIconButton
                        variant="transparent"
                        icon={<CloseIcon variant="blue" />}
                        className={classes.closeBtn}
                        onClick={this.handleClearSelectedProfile}
                      />
                    )}

                    <div className={classes.filterBtnsWrapper}>
                      <NMButton
                        variant="red"
                        className={classes.clearBtn}
                        onClick={this.handleClearFilters}
                      >
                        Reset
                      </NMButton>

                      <NMButton
                        variant="blue"
                        onClick={() =>
                          this.getChubConversationsList(selectedProfile)
                        }
                      >
                        Filter
                      </NMButton>
                    </div>
                  </div>
                )
              }
              input={
                !selectedConversation && (
                  <Grid
                    container
                    alignItems="center"
                    item
                    xs={12}
                    className={classes.filtersWrapper}
                  >
                    <Grid item xs={3} className={classes.filterItem}>
                      <NMSelect
                        value={filters.channel}
                        onChange={this.handleFilterChange('channel')}
                        label="Channel"
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="WEBCHAT">Webchat</MenuItem>
                        <MenuItem value="EMAIL">Email</MenuItem>
                      </NMSelect>
                    </Grid>

                    <Grid item xs={3} className={classes.filterItem}>
                      <NMSelect
                        value={filters.dateRange}
                        onChange={this.handleFilterChange('dateRange')}
                        label="Date Range"
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Custom">Custom</MenuItem>
                        <MenuItem value="Last Week">Last Week</MenuItem>
                        <MenuItem value="Last Month">Last Month</MenuItem>
                        <MenuItem value="Last Year">Last Year</MenuItem>
                      </NMSelect>
                    </Grid>

                    <Grid item xs={3} className={classes.filterItem}>
                      <NMInput
                        type="date"
                        variant="white"
                        value={filters.dateFrom}
                        onChange={this.handleFilterChange('dateFrom')}
                        label="Date From"
                        InputProps={{
                          className: classes.datePickerInput
                        }}
                        inputProps={{
                          max: filters.dateTo
                        }}
                        labelClassName={classes.datePickerInputLabel}
                        className={classes.datePickerInputWrapper}
                        disabled={filters.dateRange !== 'Custom'}
                      />
                    </Grid>

                    <Grid item xs={3} className={classes.filterItem}>
                      <NMInput
                        type="date"
                        variant="white"
                        value={filters.dateTo}
                        onChange={this.handleFilterChange('dateTo')}
                        label="Date To"
                        InputProps={{
                          className: classes.datePickerInput
                        }}
                        inputProps={{
                          min: filters.dateFrom
                        }}
                        labelClassName={classes.datePickerInputLabel}
                        className={classes.datePickerInputWrapper}
                        disabled={filters.dateRange !== 'Custom'}
                      />
                    </Grid>
                  </Grid>
                )
              }
            />

            {!selectedConversation && (
              <List
                conversations={conversations}
                taskSid={taskSid}
                onView={this.handleViewConversation}
              />
            )}
            {selectedConversation && (
              <>
                <Item
                  conversation={selectedConversation}
                  isDetails={true}
                  onClose={this.handleClearSelectedConversation}
                />
                <Conversation
                  conversation={selectedConversation}
                  customerName={customerName}
                />
              </>
            )}
          </>
        )}
      </ToolContent>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  toolState: state[REDUX_NAMESPACE].tools[ownProps.taskSid][ownProps.toolName],
  cmdData: state[REDUX_NAMESPACE].cmdProfile

});

const mapDispatchToProps = dispatch => ({
  setToolState: bindActionCreators(Actions.setToolState, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CustomerHistory));