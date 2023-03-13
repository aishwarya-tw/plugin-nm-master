import React, { Component } from 'react';

import { connect } from 'react-redux';
import { REDUX_NAMESPACE, INITIAL_TOOL, TOOLS } from '../../utils/constants';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';

import { MuiThemeProvider } from '@material-ui/core';

import theme from '../../themes/defaultTheme';
import ToolComponents from './ToolComponents';
import CustomerInformation from '../CustomerInformation';
class ToolContainer extends Component {
  static getDerivedStateFromProps(props, state) {
    const { taskState, task, setCurrentTool } = props;
    if (!taskState || !taskState.currentTool) {
      if (task.attributes && task.attributes.cdtRequired) {
        setCurrentTool(task.taskSid, '/disposition'); //herehere is where we pop the cdt
      } else {
        setCurrentTool(task.taskSid, INITIAL_TOOL);
      }
    }
  }

  render() {
    const { taskState, task, chatInputRef } = this.props;
    const { taskSid } = task;
    const enableCMDPanel = task.attributes.enableCMDPanel === 'true';

    // find the current tool component for the current active task
    const currentTool = (taskState && taskState.currentTool) || INITIAL_TOOL;
    const { component } = TOOLS.find(tool => tool.path === currentTool);
    const Component = ToolComponents[component];

    return (
      <div
        style={{
          display: 'flex',
          overflowY: "scroll"
        }}
      >
        {
          //Check if the Panel is enabled in the Twilio Studio Flow/ Webchat Flow
          enableCMDPanel ? (
            <div style={{ flex: '40%' , overflowY:"scroll"}}>
              <CustomerInformation task={task} />
            </div>
          ) : null
        }
        <div style={{ flex: '60%', overflowY:"scroll"}}>
          <MuiThemeProvider theme={theme}>
            <Component
              key={`${component}-${taskSid}`}
              toolName={component}
              taskSid={taskSid}
              task={task}
              chatInputRef={chatInputRef}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  taskState: state[REDUX_NAMESPACE].tools[ownProps.task.taskSid]
});

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(Actions.setCurrentTool, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolContainer);
