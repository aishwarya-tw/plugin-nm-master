import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  ButtonBase,
  Typography,
  withStyles
} from '@material-ui/core';
import styles from './styles';

import DownChevronIcon from '../../assets/DownChevronIcon';
import RightChevronIcon from '../../assets/RightChevronIcon';
import CheckIcon from '../../assets/CheckIcon';
import SearchIcon from '../../assets/SearchIcon';

import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';
import ToolScrollable from '../ToolContainer/Scrollable';
import Info from './Info';
import NMInput from '../NMInput';
import SearchIndicator from './../CustomerHistory/SearchIndicator/index';

import Resource from '../../utils/resource';
import { REDUX_NAMESPACE } from '../../utils/constants';
import { ChannelTypes, VOICE_CHANNEL_DISPOSITION_FORM_DATE } from '../../utils/constants';
const CMDProfilesResource = Resource('cmd-profiles');

class DispositionSurvey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: '',
      searchInput: ''
    };
  }

  componentDidMount = () => {
    this.getCustomerInfo();
  };

  //handle the search input change
  handleSearchInputChange = e => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      searchQuery: e.target.value
    });
  };

  //update state of the customer info change
  handleCustomerInfoChange = e => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      customer: {
        ...toolState.customer,
        [e.target.name]: e.target.value
      }
    });
  };

  //pull in taskAttr data to pre-fill the disposition form
  getCustomerInfo = () => {
    const { task, taskSid, toolName, toolState, setToolState } = this.props;
    const { attributes } = task;
    // Return in case we have already rendered this component once and we have appropriate data.
    if (toolState) {
      return;
    }

    const uniqGroups = [...new Set(this.props.cdtRecords.map(record=>record.groupName))];
    const isCore = uniqGroups?.length === 1 && uniqGroups[0] === 'Core';

    setToolState(task.taskSid, toolName, {
      ...toolState,
      loading: true,
      loadingMessage: VOICE_CHANNEL_DISPOSITION_FORM_DATE.SEARCH_MESSAGE
    });
    
    const {
      channelSid: chatChannelSid,
      channelType: channel,
      brand
    } = task.attributes;

    // Add employeeID as custom_id, if available
    const employeeEmail = task.source._worker.attributes.email;
    const employeeID = task.source._worker.attributes.employeeID;
    let cdtInfo = {
      customer: {
        name: '',
        email: ''
      },
      employee: {
        email: employeeEmail,
        custom_id : employeeID
      },
      channel,
      brand,
      ext_interaction_id: ''
    };
    if (channel === ChannelTypes.voice) {
      CMDProfilesResource.create({
        attributes: {
          ...attributes,
          findProfileInComHub: true
        }
      })
        .then(data => {
          const { cmdProfiles = [] } = data;
          let customerName = VOICE_CHANNEL_DISPOSITION_FORM_DATE.NAME;
          let emailId = VOICE_CHANNEL_DISPOSITION_FORM_DATE.EMAIL;
          let selectedProfile;
          if (cmdProfiles.length > 0) {
            // fetching the record having both firstname and email from the profile array
            for(let i = 0; i < cmdProfiles.length; i++) {
              if (cmdProfiles[i].firstName !== '' && cmdProfiles[i].firstName !== undefined && cmdProfiles[i].emails.length > 0) {
                selectedProfile = cmdProfiles[i];
                break;
              } else {
                selectedProfile = cmdProfiles[0];
              }
            }
          }
          if (selectedProfile && (selectedProfile.firstName || selectedProfile.lastName)) {
            customerName = `${selectedProfile.firstName ? selectedProfile.firstName + ' ' : ''}${selectedProfile.lastName || ''}`;
          }
          if (selectedProfile && selectedProfile.emails && selectedProfile.emails.length > 0) {
            emailId = selectedProfile.emails[0];
          }
          cdtInfo.ext_interaction_id = chatChannelSid || task.attributes.conference.sid;
          cdtInfo.customer.name = customerName;
          cdtInfo.customer.email = emailId;
          if(customerName === "Anonymous"){
            cdtInfo.customer.name = "";
           }
           if(emailId === "none"){
            cdtInfo.customer.email = "";
           }
          if(cmdProfiles.length === 0 && isCore){        
            cdtInfo.customer.name = "";
            cdtInfo.customer.email = "";
          }
          setToolState(taskSid, toolName, cdtInfo);
        })
        .catch(error => {
          const errorMessage = `Could not retrieve profiles from CMD. ${error}`;
          setToolState(task.taskSid, toolName, {
            ...toolState,
            loading: false,
            errorMessage: errorMessage
          });
        });
    } else {
      if (
        channel === ChannelTypes.chat ||
        channel === ChannelTypes.sms ||
        channel === ChannelTypes.email
      ) {
        let beforeAtName;
        if (channel === ChannelTypes.email) {
          const beforeAtPattern = /.+?(?=@)/;
          const beforeAt = beforeAtPattern.exec(task.attributes.emailAddr);
          if (beforeAt && beforeAt.length > 0) {
            beforeAtName = beforeAt[0];
          }
        }
        cdtInfo.ext_interaction_id = chatChannelSid || task.taskChannelSid;
        cdtInfo.customer.email = task.attributes.emailAddr || '';
        cdtInfo.customer.name =
          task.attributes.firstName && task.attributes.lastName
            ? `${task.attributes.firstName} ${task.attributes.lastName}`
            : task.attributes.name
              ? task.attributes.name
              : beforeAtName;
      }
      setToolState(taskSid, toolName, { ...cdtInfo, loading: false, });
    }
  };

  handleCategoryExpansion = category => (e, expanded) => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    setToolState(taskSid, toolName, {
      ...toolState,
      expandedCategory: expanded ? category : undefined
    });
  };

  handleRecordSelected = record => {
    const { taskSid, toolName, toolState, setToolState } = this.props;

    const { sendSurvey, ...recordInfo } = record;
    setToolState(taskSid, toolName, {
      ...toolState,
      selectedRecord: record,
      tags: [recordInfo],
      do_not_send: !sendSurvey
    });
  };

  renderRecords = records => {
    const { classes, toolState = {} } = this.props;
    const { selectedRecord = {} } = toolState;

    const recordItems = records.map(record => {
      const selected = selectedRecord.pk === record.pk;
      return (
        <ListItem
          onClick={() => this.handleRecordSelected(record)}
          selected={selected}
          classes={{
            root: classes.recordItemRoot,
            selected: classes.recordItemSelected
          }}
        >
          <ButtonBase className={classes.btnBase}>
            <ListItemText
              classes={{
                root: classes.recordItemTextRoot,
                primary: classes.recordItemTextPrimary,
                secondary: classes.recordItemTextSecondary
              }}
              primary={
                <div className={classes.recordLabel}>
                  {selected && (
                    <CheckIcon variant="blue" className={classes.checkIcon} />
                  )}
                  {record.subcategory}
                </div>
              }
              secondary={record.descriptions}
            />
          </ButtonBase>
        </ListItem>
      );
    });

    return <List className={classes.recordsList}>{recordItems}</List>;
  };

  renderCategories = () => {
    const { classes, toolState = {}, cdtRecords = [] } = this.props;
    const { expandedCategory } = toolState;
    let categories = cdtRecords.map(record => record.category);
    categories = [...new Set(categories)];

    //Remove the SUPPORT GROUP CONTACTS and add back at top if it exists
    const supportGroupContacts = "SUPPORT GROUP CONTACTS";
    const index = categories.indexOf(supportGroupContacts);
    if (index > -1) {
      categories.splice(index, 1);
      categories.splice(0, 0, supportGroupContacts);
    }
    // Used for implementation where SUPPORT GROUP CONTACTS is only added back if in a escalation queue
    // const escalationQueueName = "Assist - Escalation (Voice)";
    // if(this.props.task.attributes.targetQueue === escalationQueueName){
    //   categories.splice(0, 0, supportGroupContacts);
    // }

    return categories.map(category => {
      const catRecords = cdtRecords.filter(
        record => record.category === category
      );
      const Icon =
        expandedCategory === category ? DownChevronIcon : RightChevronIcon;
      return (
        <ExpansionPanel
          expanded={expandedCategory === category}
          onChange={this.handleCategoryExpansion(category)}
          classes={{
            root: classes.panelRoot,
            expanded: classes.panelExpanded
          }}
        >
          <ExpansionPanelSummary
            classes={{
              root: classes.summaryRoot,
              content: classes.summaryContent,
              expanded: classes.summaryExpanded
            }}
          >
            <Typography className={classes.categoryLabel}>
              {category}
            </Typography>
            <Icon variant="blue" />
          </ExpansionPanelSummary>

          <ExpansionPanelDetails className={classes.details}>
            {this.renderRecords(catRecords)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
  };

  renderSearchResults = () => {
    const { toolState = {}, cdtRecords = [] } = this.props;
    const { searchQuery = '' } = toolState;

    const re = new RegExp(searchQuery, 'i');
    const records = cdtRecords.filter(record => {
      const { category = '', subcategory = '', descriptions = '' } = record;
      const contains = str => re.test(str);
      return (
        contains(category) || contains(subcategory) || contains(descriptions)
      );
    });

    return this.renderRecords(records);
  };

  render() {
    const { classes, toolState = {}, taskSid } = this.props;
    const {
      searchQuery = '',
      customer = {},
      channel,
      brand,
      selectedRecord = {},
      loading,
      loadingMessage
    } = toolState;

    return (
      <ToolContent taskSid={taskSid}>
        {loading && <SearchIndicator message={loadingMessage} />}
        <ToolHeader
          label={
            <Typography variant="h5" className={classes.label}>
              Disposition
            </Typography>
          }
          input={
            <NMInput
              variant="white"
              placeholder="Search reasons"
              value={searchQuery}
              onChange={this.handleSearchInputChange}
              InputProps={{
                endAdornment: (
                  <SearchIcon variant="grey" className={classes.searchIcon} />
                )
              }}
            />
          }
        />

        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`${taskSid}-cdt`}
        >
          <div>
            {searchQuery && searchQuery !== ''
              ? this.renderSearchResults()
              : this.renderCategories()}
          </div>
        </ToolScrollable>
        
        <Info
          selectedRecord={selectedRecord.subcategory}
          customer={customer}
          channel={channel}
          brand={brand}
          loading={loading}
          onInfoChange={this.handleCustomerInfoChange}
        />
      </ToolContent>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  toolState: state[REDUX_NAMESPACE].tools[ownProps.taskSid][ownProps.toolName],
  cdtRecords: state[REDUX_NAMESPACE].cdtRecords
});

const mapDispatchToProps = dispatch => ({
  setToolState: bindActionCreators(Actions.setToolState, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DispositionSurvey));