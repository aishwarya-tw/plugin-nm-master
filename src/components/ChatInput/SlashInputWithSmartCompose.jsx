import React, { Component } from 'react';
import { MuiThemeProvider, Grid, ClickAwayListener } from '@material-ui/core';
import SlashPopoverContent from '../SlashInput/SlashPopoverContent';
import Popover from 'react-tiny-popover';
import { getSlashTriggers, getCursorSlashTrigger } from '../../utils/input-helpers';
import defaultTheme from '../../themes/defaultTheme';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as ToolActions } from '../../states/ToolsReducer';
import { Actions as ResponseActions } from '../../states/ResponseLibraryReducer';
import { REDUX_NAMESPACE } from '../../utils/constants';
import { withTaskContext } from '@twilio/flex-ui';
import { CrestaSmartCompose } from './CrestaSmartCompose/CrestaSmartCompose';

class SlashInputWithSmartCompose extends Component {
  state = {
    enablePopover: false,
    selectionStart: 0,
    selectionEnd: 0,
    slashTriggers: [],
    width: undefined
  };

  openResponseLibrary = () => {
    const { task, tools, setCurrentTool } = this.props;
    if (tools && tools[task.taskSid]) {
      const { currentTool } = tools[task.taskSid];
      if (currentTool !== '/responses') {
        this.setState({ enablePopover: false });
        setCurrentTool(task.taskSid, '/responses');
      }
    }
  };

  handleClickAway = event => {
    const { inputRef } = this.props;
    if (inputRef.current.contains(event.target)) {
      return;
    }
    this.setState({ enablePopover: false });
  };

  handleInputFocus = (event) => {
    const { target } = event;
    const { selectionStart, selectionEnd } = target;
    // Disable popover on focus to allow click event to enable it
    this.setState({
      selectionStart,
      selectionEnd,
      slashTriggers: getSlashTriggers(target.value),
      enablePopover: false
    });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleInputClick = event => {
    const { target } = event;
    const { slashTriggers } = this.state;
    const { selectionStart, selectionEnd } = event.target;
    this.setState({
      selectionStart,
      selectionEnd,
      enablePopover: slashTriggers.length > 0,
      width: target.offsetWidth
    });
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  handleInputKeyDown = (event) => {
    const { target } = event;
    const { slashTriggers } = this.state;
    const { selectionStart, selectionEnd } = event.target;
    if (event.detail.key === 'Escape') {
      this.setState({ enablePopover: false });
    } else if (event.detail.key === 'Tab') {
      const { enablePopover } = this.state;
      if (enablePopover) {
        const { slashMatches } = this.props;
        const trigger = getCursorSlashTrigger(slashTriggers, selectionStart, selectionEnd);
        const response = (trigger && slashMatches[trigger.shortCode]) ? slashMatches[trigger.shortCode] : undefined;
        if (response !== undefined) {
          event.detail.preventDefault();
          this.handleInsertResponse(trigger, response);
        }
      }
    } else {
      this.setState({
        enablePopover: slashTriggers.length > 0,
        width: target.offsetWidth
      });
    }
    this.setState({
      selectionStart,
      selectionEnd
    });
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };

  handleInputChange = (event) => {
    const { target } = event;
    const { selectionStart, selectionEnd } = target;
    const { task, slashSearchQuery } = this.props;
    const slashTriggers = getSlashTriggers(target.value);
    if (slashTriggers.length > 0) {
      slashSearchQuery(task, slashTriggers);
    }
    this.setState({
      slashTriggers,
      selectionStart,
      selectionEnd,
      enablePopover: slashTriggers.length > 0,
      width: target.offsetWidth
    });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  handleInsertResponse = (trigger, response) => {
    const { onInsertResponse, removeSlashMatch } = this.props;
    if (onInsertResponse) {
      const { task, inputRef } = this.props;
      const { value } = inputRef.current;
      const startSlice = value.substring(0, trigger.start);
      const endSlice = value.substring(trigger.end);
      const newCursorPosition = `${startSlice}${response.body}`.length;
      const newInputText = `${startSlice}${response.body}${endSlice}`;
      const slashTriggers = getSlashTriggers(newInputText);
      const enablePopover = getCursorSlashTrigger(slashTriggers, newCursorPosition, newCursorPosition) !== undefined;
      onInsertResponse(newInputText, newCursorPosition);
      // This will triger rerender and re-enable smart compose, it should be put after onInsertResponse.
      removeSlashMatch(task.taskSid, trigger.shortCode);
      this.setState({
        enablePopover,
        slashTriggers,
        selectionStart: newCursorPosition,
        selectionEnd: newCursorPosition
      });
    }
  }

  render() {
    const { inputText, slashMatches, onInsertResponse, ...props } = this.props;
    const { enablePopover, width, slashTriggers, selectionStart, selectionEnd } = this.state;
    const trigger = getCursorSlashTrigger(slashTriggers, selectionStart, selectionEnd);
    const response = (trigger && slashMatches && slashMatches[trigger.shortCode]) ? slashMatches[trigger.shortCode] : undefined;
    const openPopover = enablePopover && response !== undefined;
    
    return (
      <MuiThemeProvider theme={defaultTheme}>
        <Grid container item xs={12}>
          <Popover
            isOpen={openPopover}
            padding={4}
            transitionDuration={0.2}
            content={
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={this.handleClickAway}>
                <SlashPopoverContent
                  width={width}
                  response={response}
                  trigger={trigger}
                  openResponseLibrary={this.openResponseLibrary}
                  onInsertResponse={this.handleInsertResponse} />
              </ClickAwayListener>
            }>
            <CrestaSmartCompose
              {...props}
              onSelectionChange={this.handleSelectionChange}
              disableSuggestion={openPopover}
              onFocus={this.handleInputFocus}
              onKeyDown={this.handleInputKeyDown}
              onClick={this.handleInputClick}
              onChange={this.handleInputChange} />
          </Popover>
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
    slashMatches: responseLibrary.slashSearch[task.taskSid]
  };
};

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(ToolActions.setCurrentTool, dispatch),
  slashSearchQuery: bindActionCreators(ResponseActions.slashSearchQuery, dispatch),
  removeSlashMatch: bindActionCreators(ResponseActions.removeSlashMatch, dispatch)
});

export default withTaskContext(
  connect(mapStateToProps, mapDispatchToProps)(SlashInputWithSmartCompose)
);