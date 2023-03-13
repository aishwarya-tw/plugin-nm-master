import React, { Component } from 'react';
import { MuiThemeProvider, Grid } from '@material-ui/core';
import NMInput from '../../NMInput';
import defaultTheme from '../../../themes/defaultTheme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as ToolActions } from '../../../states/ToolsReducer';
import { Actions as ResponseActions } from '../../../states/ResponseLibraryReducer';
import { REDUX_NAMESPACE } from '../../../utils/constants';
import { withTaskContext } from '@twilio/flex-ui';

class ResponseLibrarySearchInput extends Component {
  render() {
    const { onInsertResponse, onChange, ...props } = this.props;

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <Grid container item xs={12}>
          <NMInput
            {...props}
            onSelectionChange={this.handleSelectionChange}
            onFocus={this.handleInputFocus}
            onKeyDown={this.handleInputKeyDown}
            onKeyUp={this.handleInputKeyUp}
            onClick={this.handleInputClick}
            onChange={onChange}
          />
        </Grid>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { task } = ownProps;
  const { tools, responseLibrary } = state[REDUX_NAMESPACE];

  return {
    tools,
    responseLibraryMatches: responseLibrary.responseLibrarySearch[task.taskSid]
  };
};

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(ToolActions.setCurrentTool, dispatch),
  responseLibraryQuery: bindActionCreators(
    ResponseActions.responseLibraryQuery,
    dispatch
  )
});

export default withTaskContext(
  connect(mapStateToProps, mapDispatchToProps)(ResponseLibrarySearchInput)
);
