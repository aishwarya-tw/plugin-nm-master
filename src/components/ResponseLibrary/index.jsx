import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/ToolsReducer';
import { Actions as EmailActions } from '../../states/EmailReducer';
import { Actions as ChatActions } from '../../states/ChatInputReducer';
import { Actions as ResponseActions } from '../../states/ResponseLibraryReducer';

import {
  REDUX_NAMESPACE,
  RESPONSE_LIBRARY_SAVED_NOTIFICATION,
  RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION,
  BACKEND_ERROR_NOTIFICATION
} from '../../utils/constants';

import { fetchResponses } from '../../init/DataRetrieval';

import { Typography, withStyles, LinearProgress } from '@material-ui/core';
import styles from './styles';
import flexMuiTheme from '../../themes/flexMuiTheme';

import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';

import NMButton from '../NMButton';
import AddIcon from '../../assets/AddIcon';
import SearchIcon from '../../assets/SearchIcon';

import SearchInput from './Search';
import NoResults from './Search/NoResults';
import SearchResults from './Search/SearchResults';
import List from './List';
import Frequent from './Frequent';
import Details from './Details';
import Edit from './Edit';
import Resource from '../../utils/resource';

const ShortcodeTallyResource = Resource('update-or-create-shortcode-tally');
const CreateUpdateResponseLibraryRecordsResource = Resource(
  'create-update-response-library-records'
);

const UpdateShortcodesResource = Resource('update-shortcodes');

const manager = Flex.Manager.getInstance();

class ResponseLibrary extends Component {
  constructor(props) {
    super(props);
    this.inputRef = props.chatInputRef;
    this.state = {
      loading: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { taskSid, toolName, toolState, setToolState } = props;
    if (!toolState) {
      setToolState(taskSid, toolName, {
        currentTab: 'global',
        searchQuery: '',
        searchResult: undefined
      });
    }
  }

  handleInsertResponse = async response => {
    const { task, setInputText, setEmailBody, chatInput = {} } = this.props;
    const { inputText = '' } = chatInput;
    const selectionStart = this.inputRef.current.selectionStart;
    const selectionEnd = this.inputRef.current.selectionEnd;
    const startSlice = inputText.substring(0, selectionStart);
    const endSlice = inputText.substring(selectionEnd);
    const newInputText = `${startSlice}${response.body}${endSlice}`;

    if (task.attributes.channelType === 'email') {
      setEmailBody(task.taskSid, newInputText);
    } else {
      setInputText(task.taskSid, newInputText);
    }

    try {
      if (response.pk === 'global') {
        await ShortcodeTallyResource.create({
          shortCode: response.sk
        });
        console.log('Updated shortcode tally for item ', response.sk);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = `${error}. Failed to update shortcode tally.`;
      Flex.Notifications.dismissNotificationById(BACKEND_ERROR_NOTIFICATION);
      Flex.Notifications.showNotification(BACKEND_ERROR_NOTIFICATION, {
        errorMessage
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { setToolState, toolName, toolState, taskSid } = this.props;

    const { responseLibrary: currState } = this.props;
    const { responseLibrary: oldState } = prevProps;
    if (
      JSON.stringify(oldState) !== JSON.stringify(currState) &&
      toolState &&
      toolState.searchQuery
    ) {
      setToolState(taskSid, toolName, {
        ...toolState,
        searchResult: currState.responseLibrarySearch[taskSid]
      });

      setTimeout(
        () =>
          this.setState({
            loading: false
          }),
        250
      );
    } else if (toolState && !toolState.searchQuery) {
      setTimeout(
        () =>
          this.setState({
            loading: false
          }),
        250
      );
    }
  };

  handleInputChange = event => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      setToolState,
      responseLibraryQuery
    } = this.props;
    const { currentTab } = toolState;

    if (event.target.value === '') {
      responseLibraryQuery(task, false, currentTab);
      setToolState(taskSid, toolName, {
        ...toolState,
        searchQuery: undefined,
        searchResult: undefined
      });

      this.setState({ loading: false });

      return;
    } else if (event.target.value.length < 2) {
      return;
    }

    this.setState({ loading: true });

    responseLibraryQuery(task, event.target.value, currentTab);
    setToolState(taskSid, toolName, {
      ...toolState,
      searchQuery: event.target.value
    });
  };

  handleTabSelected = tab => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      setToolState,
      responseLibraryQuery,
      responseLibrary
    } = this.props;

    if (toolState.searchQuery) {
      responseLibraryQuery(task, toolState.searchQuery, tab);
      setToolState(taskSid, toolName, {
        ...toolState,
        currentTab: tab,
        searchResult: responseLibrary.responseLibrarySearch[taskSid]
      });
    } else {
      setToolState(taskSid, toolName, {
        ...toolState,
        currentTab: tab,
        searchResult: undefined
      });
    }
  };

  handleViewResponse = response => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    setToolState(taskSid, toolName, {
      ...toolState,
      selectedResponse: response
    });
  };

  handleShowEdit = response => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    setToolState(taskSid, toolName, {
      ...toolState,
      editOriginalResponse: response,
      editingResponse: response
    });
  };

  handleEditInputChange = field => e => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    let newState = {
      editingResponse: {
        ...toolState.editingResponse,
        [field]: e.target.value
      }
    };

    if (field === 'title') {
      newState.editTitleExists = false;
    }

    if (field === 'shortCode') {
      newState.editShortCodeExists = false;
    }

    setToolState(taskSid, toolName, {
      ...toolState,
      ...newState
    });
  };

  handleCheckExistingTitle = e => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      setToolState,
      responseLibrary
    } = this.props;

    const { editOriginalResponse } = toolState;
    const editTitle = e.target.value;

    if (!editOriginalResponse || editOriginalResponse.title !== editTitle) {
      const { brand } = task.attributes;
      const workerResponses = responseLibrary.data.worker[brand] || [];
      const responseTitles = workerResponses.map(response => response.title);
      const titleExists = responseTitles.indexOf(editTitle) > -1;

      setToolState(taskSid, toolName, {
        ...toolState,
        editTitleExists: titleExists
      });
    }
  };

  handleCheckExistingShortCode = e => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      setToolState,
      responseLibrary
    } = this.props;

    const { editOriginalResponse } = toolState;
    const editShortCode = e.target.value;

    if (
      !editOriginalResponse ||
      editOriginalResponse.shortCode !== editShortCode
    ) {
      const { brand } = task.attributes;
      const workerResponses = responseLibrary.data.worker[brand] || [];
      const responseShortCodes = workerResponses.map(
        response => response.shortCode
      );
      const shortCodeExists = responseShortCodes.indexOf(editShortCode) > -1;

      setToolState(taskSid, toolName, {
        ...toolState,
        editShortCodeExists: shortCodeExists
      });
    }
  };

  handleClearResponse = () => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      currentTab,
      setToolState,
      responseLibraryQuery
    } = this.props;
    responseLibraryQuery(task, false, currentTab);

    setToolState(taskSid, toolName, {
      ...toolState,
      selectedResponse: undefined,
      searchQuery: undefined,
      searchResult: undefined
    });
  };

  handleCancelEdit = () => {
    const {
      task,
      taskSid,
      toolName,
      toolState,
      currentTab,
      setToolState,
      responseLibraryQuery
    } = this.props;
    responseLibraryQuery(task, false, currentTab);
    setToolState(taskSid, toolName, {
      ...toolState,
      editOriginalResponse: undefined,
      editingResponse: undefined,
      searchQuery: undefined,
      searchResult: undefined
    });
  };

  handleSaveAddEdit = () => {
    const { toolState } = this.props;
    const { editOriginalResponse } = toolState;

    let { shortCode, body, category, title } = toolState.editingResponse;
    const workerSid = manager.workerClient.sid;

    const alphaNeumericPattern = /[\W_]+/g;

    shortCode = shortCode.replace(alphaNeumericPattern, '');

    const formatted = {
      pk: workerSid,
      sk: shortCode,
      body: body,
      category: category,
      title: title
    };

    const newResponse = {
      pk: workerSid,
      sk: shortCode,
      body: body,
      title: title,
      category: category,
      shortCode: shortCode
    };

    const hasEditedShortcode =
      toolState &&
      toolState.editOriginalResponse &&
      toolState.editingResponse &&
      toolState.editOriginalResponse.shortCode !==
        toolState.editingResponse.shortCode;

    const self = this;
    if (
      !toolState.editOriginalResponse ||
      (toolState.editOriginalResponse && !hasEditedShortcode)
    ) {
      CreateUpdateResponseLibraryRecordsResource.create(formatted)
        .then(data => {
          Flex.Notifications.dismissNotificationById(
            RESPONSE_LIBRARY_SAVED_NOTIFICATION
          );
          Flex.Notifications.showNotification(
            RESPONSE_LIBRARY_SAVED_NOTIFICATION
          );

          self.handleClearResponse();
          self.handleCancelEdit();
          fetchResponses(manager);
        })
        .catch(error => {
          Flex.Notifications.dismissNotificationById(
            RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION
          );
          Flex.Notifications.showNotification(
            RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION
          );
        });
    } else {
      UpdateShortcodesResource.create({
        oldResponse: editOriginalResponse,
        newResponse: newResponse
      })
        .then(data => {
          Flex.Notifications.dismissNotificationById(
            RESPONSE_LIBRARY_SAVED_NOTIFICATION
          );
          Flex.Notifications.showNotification(
            RESPONSE_LIBRARY_SAVED_NOTIFICATION
          );

          self.handleClearResponse();
          self.handleCancelEdit();
          fetchResponses(manager);
        })
        .catch(error => {
          Flex.Notifications.dismissNotificationById(
            RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION
          );
          Flex.Notifications.showNotification(
            RESPONSE_LIBRARY_SAVE_FAILED_NOTIFICATION
          );
        });
    }
  };

  handleCategorySelected = (type, category) => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    setToolState(taskSid, toolName, {
      ...toolState,
      selectedCategory: {
        ...toolState.selectedCategory,
        [type]: category
      }
    });
  };

  handleShowAdd = () => {
    const { taskSid, toolName, toolState, setToolState } = this.props;
    setToolState(taskSid, toolName, {
      ...toolState,
      editOriginalResponse: null,
      editingResponse: {
        title: '',
        category: '',
        shortCode: '',
        body: ''
      }
    });
  };

  render() {
    const {
      taskSid,
      task,
      toolState = {},
      responseLibrary,
      classes,
      chatInputRef
    } = this.props;
    const { brand } = task.attributes;
    const { isLoaded, data } = responseLibrary;
    const {
      currentTab = 'global',
      searchQuery,
      searchResult,
      selectedResponse,
      editingResponse,
      editTitleExists,
      editShortCodeExists,
      selectedCategory
    } = toolState;

    const { loading } = this.state;
    const responses =
      isLoaded && data[currentTab][brand] ? data[currentTab][brand] : [];
    const frequentResponses =
      isLoaded && data['frequent'] ? data['frequent'] : [];
    const responseSet = selectedResponse || editingResponse;
    return (
      <ToolContent taskSid={taskSid}>
        <ToolHeader
          label={
            <Typography variant="h5" className={classes.label}>
              Response Library
            </Typography>
          }
          secondaryAction={
            !responseSet && (
              <NMButton variant="transparent" onClick={this.handleShowAdd}>
                <AddIcon variant="blue" className={classes.addIcon} />
                Add New
              </NMButton>
            )
          }
          input={
            !responseSet && (
              <SearchInput
                onChange={this.handleInputChange}
                variant="white"
                InputProps={{
                  endAdornment: (
                    <SearchIcon variant="grey" className={classes.searchIcon} />
                  )
                }}
                className={classes.searchInput}
              />
            )
          }
        />

        {!responseSet && (
          <div className={classes.tabsWrapper}>
            <Flex.Tabs
              onTabSelected={this.handleTabSelected}
              selectedTabName={currentTab}
            >
              <Flex.Tab theme={flexMuiTheme} label="Browse" uniqueName="global">
                <React.Fragment />
              </Flex.Tab>

              <Flex.Tab
                theme={flexMuiTheme}
                label="Frequently Used"
                uniqueName="frequent"
              >
                <React.Fragment />
              </Flex.Tab>

              <Flex.Tab
                theme={flexMuiTheme}
                label="My Responses"
                uniqueName="worker"
              >
                <React.Fragment />
              </Flex.Tab>
            </Flex.Tabs>
          </div>
        )}

        {loading && <LinearProgress className={classes.progress} />}

        {!responseSet &&
          !loading &&
          !searchResult &&
          !editingResponse &&
          currentTab !== 'frequent' && (
            <List
              chatInputRef={chatInputRef}
              taskSid={taskSid}
              responses={responses}
              selectedCategory={selectedCategory}
              onCategorySelected={this.handleCategorySelected}
              onView={this.handleViewResponse}
              onEdit={this.handleEditResponse}
              type={currentTab}
              onClick={this.handleInsertResponse}
            />
          )}

        {!!searchQuery &&
          !loading &&
          !selectedResponse &&
          (!searchResult || (!!searchResult && !searchResult.length)) &&
          !editingResponse && <NoResults />}

        {!!searchResult &&
          !!searchResult.length &&
          !selectedResponse &&
          !loading &&
          !editingResponse && (
            <SearchResults
              taskSid={taskSid}
              responses={searchResult}
              selectedCategory={null}
              onCategorySelected={this.handleCategorySelected}
              onView={this.handleViewResponse}
              onEdit={this.handleEditResponse}
              type={currentTab}
              onClick={this.handleInsertResponse}
            />
          )}

        {!loading &&
          !responseSet &&
          currentTab === 'frequent' &&
          !searchResult &&
          !editingResponse && (
            <Frequent
              chatInputRef={chatInputRef}
              taskSid={taskSid}
              responses={
                frequentResponses && frequentResponses.length
                  ? frequentResponses
                  : []
              }
              onView={this.handleViewResponse}
              onClick={this.handleInsertResponse}
              onEdit={this.handleEditResponse}
              type={currentTab}
            />
          )}

        {selectedResponse && !editingResponse && !loading && (
          <Details
            chatInputRef={chatInputRef}
            response={selectedResponse}
            isPersonal={currentTab === 'worker'}
            onClick={this.handleInsertResponse}
            onEdit={this.handleShowEdit}
            onClose={this.handleClearResponse}
          />
        )}

        {editingResponse && (
          <Edit
            response={editingResponse}
            titleExists={editTitleExists}
            shortCodeExists={editShortCodeExists}
            handleCheckExistingTitle={this.handleCheckExistingTitle}
            handleCheckExistingShortCode={this.handleCheckExistingShortCode}
            onEditInputChange={this.handleEditInputChange}
            onSave={this.handleSaveAddEdit}
            onCancel={this.handleCancelEdit}
          />
        )}
      </ToolContent>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  chatInput: state[REDUX_NAMESPACE].chatInput[ownProps.task.taskSid],
  toolState: state[REDUX_NAMESPACE].tools[ownProps.taskSid][ownProps.toolName],
  responseLibrary: state[REDUX_NAMESPACE].responseLibrary
});

const mapDispatchToProps = dispatch => ({
  setEmailBody: bindActionCreators(EmailActions.setEmailBody, dispatch),
  setInputText: bindActionCreators(ChatActions.setInputText, dispatch),
  responseLibraryQuery: bindActionCreators(
    ResponseActions.responseLibraryQuery,
    dispatch
  ),
  setToolState: bindActionCreators(Actions.setToolState, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ResponseLibrary));
