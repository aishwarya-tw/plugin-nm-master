import React, { Component } from 'react';
import { Icon } from '@twilio/flex-ui';
import NMIconButton from '../NMIconButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as ToolActions } from '../../states/ToolsReducer';

class TransferButton extends Component {
  handleClick = () => {
    const { task, setCurrentTool } = this.props;
    setCurrentTool(task.taskSid, '/chat-transfer');
  };

  render() {
    const { disabled, classes, className } = this.props;
    return (
      <NMIconButton
        icon={<Icon icon="Transfer" />}
        variant="transparent"
        onClick={this.handleClick}
        disabled={disabled}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(ToolActions.setCurrentTool, dispatch)
});

export default connect(null, mapDispatchToProps)(TransferButton);
