import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import ToolScrollable from '../ToolContainer/Scrollable';
import SearchIndicator from '../CustomerHistory/SearchIndicator';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core';
import theme from '../../themes/defaultTheme';
import {
  REDUX_NAMESPACE,
  BACKEND_ERROR_NOTIFICATION
} from '../../utils/constants';
import { Grid, Typography, MenuItem, withStyles } from '@material-ui/core';
import styles from './styles';
import ToolHeader from './Header';
import NMInput from '../NMInput';
import NMSelect from '../NMSelect';
import NMButton from '../NMButton';
import List from './List';
import Conversation from './Conversation';
import Resource from '../../utils/resource';
import { Brand, Channel, DateRange } from '../../utils/constants';
import ConversationItem from './ConversationItem';
const CMDProfilesResource = Resource('cmd-profiles');
const CHUBConversation = Resource('get-chub-conversation');
const CHUBManagmentConversationSearch = Resource(
  'get-chub-managment-conv-search'
);
const initialFilters = {
  channel: 'All',
  dateRange: 'None',
  dateFrom: '',
  dateTo: '',
  brand: 'None',
  cdtDispositionCategory: 'Select Disposition Category',
  cdtDispositionSubCat: 'Select Disposition SubCategory',
  contactPoint: '',
  associateName: '',
  keywordSearch: '',
  twilioConvID: ''
};
class GlobalConversationSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: initialFilters
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  getCustomerInfo = conversation => {
    this.setState({
      ...this.state,
      loading: true,
      loadingMessage: 'Fetching Selected conversations '
    });
    const { filters } = this.state;
    let attributes = {};
    let customerName = '';
    let selectedProfile = {};
    const { Messages } = conversation;
    const ExternalAddress = Messages[0].ExternalAddress;
    if (conversation.MessageType === 'WEBCHAT') attributes.channelType = 'web';
    else attributes.channelType = conversation.MessageType.toLowerCase();
    attributes.emailAddr = ExternalAddress; //"ramesh.yedurla@gmail.com";
    attributes.phoneNum = ExternalAddress;
    CMDProfilesResource.create({ attributes })
      .then(data => {
        const { cmdProfiles = [] } = data;
        // When no profiles or 1 profile is returned, automatically sets "selectedProfile"
        if (cmdProfiles.length === 0) {
          selectedProfile = {
            phones: [attributes.phoneNum],
            emails: [attributes.emailAddr]
          };
        } else if (cmdProfiles.length === 1) {
          selectedProfile = cmdProfiles[0];
        } else {
          selectedProfile = cmdProfiles[0];
        }
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
          customerName = filters.contactPoint
            ? filters.contactPoint
            : 'Unknown';
        }
        this.setState({
          ...this.state,
          selectedCustomerName: customerName,
          loading: false
        });
      })
      .catch(error => {
        console.log('Error retrieving CMD profiles', error);
        const errorMessage = `Could not retrieve profiles from CMD. ${error}`;
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
      });
  };

  handleFilterChange = filter => e => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        [filter]: e.target.value
      }
    });
  };

  getManagmentConvSearchFromChub = filters => {
    this.setState({
      ...this.state,
      loading: true,
      loadingMessage: 'Fetching conversations list'
    });
    CHUBManagmentConversationSearch.create(filters)
      .then(data => {
        const { retrievedMangmentConvSearch = [] } = data;
        this.setState({
          ...this.state,
          conversations: retrievedMangmentConvSearch.map(conversation => {
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
          selectedProfile: undefined,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
        const errorMessage = `Could not retrieve conversations list from CHUB ${error}`;
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });
        this.setState({
          ...this.state,
          loading: false,
          loadingMessage: 'Fetching conversation details'
        });
      });
  };

  handleViewConversation = conversation => {
    this.setState({
      ...this.state,
      loading: true,
      loadingMessage: 'Fetching conversation details'
    });

    CHUBConversation.read({ conversationId: conversation.ConversationId })
      .then(data => {
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
        this.getCustomerInfo(conversation);
        this.setState({
          ...this.state,
          selectedConversation: conversation,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
        const errorMessage = 'Could not retrieve conversation from CHUB.';
        Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
          errorMessage
        });

        this.setState({
          ...this.state,
          loading: false,
          loadingMessage: 'Fetching conversation details'
        });
      });
  };

  handleClearSelectedProfile = () => {
    const { profiles } = this.state;

    if (profiles && profiles.length > 1) {
      this.setState({
        ...this.state,
        selectedProfile: undefined
      });
    }
  };

  handleClearSelectedConversation = () => {
    this.setState({
      ...this.state,
      selectedConversation: undefined
    });
  };

  renderBrands = brands => {
    return brands.map(brand => {
      return <MenuItem value={brand}>{brand}</MenuItem>;
    });
  };

  renderChannels = channels => {
    return channels.map(channel => {
      return <MenuItem value={channel}>{channel}</MenuItem>;
    });
  };

  renderDateRanges = dateranges => {
    return dateranges.map(daterange => {
      return <MenuItem value={daterange}>{daterange}</MenuItem>;
    });
  };

  renderCategory = () => {
    const { cdtRecords = [] } = this.props;
    let categories = cdtRecords.map(record => record.category);
    categories = [...new Set(categories)];

    return categories.map(category => {
      return <MenuItem value={category}>{category}</MenuItem>;
    });
  };

  renderSubCategory = () => {
    const { cdtRecords = [] } = this.props;
    const selectedCategory = this.state.filters.cdtDispositionCategory;
    let subcategories = cdtRecords.map(record => {
      if (record.category === selectedCategory) {
        return record.subcategory;
      }

      return null;
    });
    subcategories = [...new Set(subcategories)];
    console.log('subcategories :' + subcategories);
    return subcategories.map(subcategory => {
      if (subcategory !== undefined) {
        return <MenuItem value={subcategory}>{subcategory}</MenuItem>;
      }

      return null;
    });
  };

  handleClearFilters = () => {
    this.setState({
      ...this.state,
      filters: initialFilters,
      selectedConversation: undefined,
      conversations: undefined
    });
  };

  render() {
    console.log('GLOBAL SEARCH Sate, Props: ', this.state, this.props);
    const brands = Object.values(Brand);
    const channels = Object.values(Channel);
    const dateranges = Object.values(DateRange);
    const { classes } = this.props;
    const {
      loading,
      loadingMessage,
      conversations,
      selectedConversation,
      selectedCustomerName
    } = this.state || {};

    return (
      <MuiThemeProvider theme={theme}>
        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`global-search`}
        >
          {loading && <SearchIndicator message={loadingMessage} />}
          <ToolHeader
            label={
              <div>
                <Typography variant="h6" className={classes.toolLabel}>
                  Global Conversation Search
                </Typography>
              </div>
            }
            secondaryAction={
              !selectedConversation && (
                <div className={classes.secondaryWrapper}>
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
                        this.getManagmentConvSearchFromChub(this.state)
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
                      value={this.state.filters.channel}
                      onChange={this.handleFilterChange('channel')}
                      label="Channel"
                    >
                      {this.renderChannels(channels)};
                    </NMSelect>
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMSelect
                      value={this.state.filters.dateRange}
                      onChange={this.handleFilterChange('dateRange')}
                      label="Date Range"
                    >
                      {this.renderDateRanges(dateranges)};
                    </NMSelect>
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="date"
                      variant="white"
                      value={this.state.filters.dateFrom}
                      onChange={this.handleFilterChange('dateFrom')}
                      label="Date From"
                      InputProps={{
                        className: classes.datePickerInput
                      }}
                      inputProps={{
                        max: this.state.filters.dateTo
                      }}
                      labelClassName={classes.datePickerInputLabel}
                      className={classes.datePickerInputWrapper}
                      disabled={this.state.filters.dateRange !== 'Custom'}
                    />
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="date"
                      variant="white"
                      value={this.state.filters.dateTo}
                      onChange={this.handleFilterChange('dateTo')}
                      label="Date To"
                      InputProps={{
                        className: classes.datePickerInput
                      }}
                      inputProps={{
                        min: this.state.filters.dateFrom
                      }}
                      labelClassName={classes.datePickerInputLabel}
                      className={classes.datePickerInputWrapper}
                      disabled={this.state.filters.dateRange !== 'Custom'}
                    />
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMSelect
                      value={this.state.filters.brand}
                      onChange={this.handleFilterChange('brand')}
                      label="Brand"
                    >
                      {this.renderBrands(brands)};
                    </NMSelect>
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMSelect
                      value={this.state.filters.cdtDispositionCategory}
                      onChange={this.handleFilterChange(
                        'cdtDispositionCategory'
                      )}
                      label="CDT Disposition Category"
                    >
                      <MenuItem value="Select Disposition Category">
                        Select Disposition Category
                      </MenuItem>
                      {this.renderCategory()};
                    </NMSelect>
                  </Grid>
                  <Grid item xs={3} className={classes.filterItem}>
                    <NMSelect
                      value={this.state.filters.cdtDispositionSubCat}
                      onChange={this.handleFilterChange('cdtDispositionSubCat')}
                      label="CDT Disposition SubCategory"
                      disabled={
                        this.state.filters.cdtDispositionCategory ===
                        'Select Disposition Category'
                      }
                    >
                      <MenuItem value="Select Disposition SubCategory">
                        Select Disposition SubCategory
                      </MenuItem>
                      {this.renderSubCategory()};
                    </NMSelect>
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="TextField"
                      value={this.state.filters.associateName}
                      onChange={this.handleFilterChange('associateName')}
                      label="Associate Name"
                      InputProps={{
                        className: classes.associateNameInput
                      }}
                      labelClassName={classes.textFieldInputLabel}
                      className={classes.textFieldInputWrapper}
                    />
                  </Grid>
                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="TextField"
                      value={this.state.filters.contactPoint}
                      onChange={this.handleFilterChange('contactPoint')}
                      label="Customer Contact Point"
                      InputProps={{
                        className: classes.contactPointInput
                      }}
                      labelClassName={classes.textFieldInputLabel}
                      className={classes.textFieldInputWrapper}
                    />
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="TextField"
                      value={this.state.filters.keywordSearch}
                      onChange={this.handleFilterChange('keywordSearch')}
                      label="Keyword Search"
                      InputProps={{
                        className: classes.keywordSearchInput
                      }}
                      labelClassName={classes.textFieldInputLabel}
                      className={classes.textFieldInputWrapper}
                    />
                  </Grid>

                  <Grid item xs={3} className={classes.filterItem}>
                    <NMInput
                      type="TextField"
                      value={this.state.filters.twilioConvID}
                      onChange={this.handleFilterChange('twilioConvID')}
                      label="Twilio Conversation ID"
                      InputProps={{
                        className: classes.twilioConvIDInput
                      }}
                      labelClassName={classes.textFieldInputLabel}
                      className={classes.textFieldInputWrapper}
                    />
                  </Grid>
                </Grid>
              )
            }
          />

          {!selectedConversation && (
            <List
              conversations={conversations}
              onView={this.handleViewConversation}
            />
          )}

          {selectedConversation && selectedCustomerName && (
            <>
              <ConversationItem
                conversation={selectedConversation}
                isDetails={true}
                onClose={this.handleClearSelectedConversation}
              />

              <Conversation
                conversation={selectedConversation}
                customerName={selectedCustomerName}
              />
            </>
          )}
        </ToolScrollable>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  cdtRecords: state[REDUX_NAMESPACE].cdtRecords
});

export default connect(mapStateToProps)(
  withStyles(styles)(GlobalConversationSearch)
);
