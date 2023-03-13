import React from 'react';
import clsx from 'clsx';
import { Icon, withStyles } from '@material-ui/core';
import styles from './styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as ChatActions } from '../../../states/ChatTransferReducer';
import { REDUX_NAMESPACE } from '../../../utils/constants';

class MessageCheckbox extends React.Component {
  handleClick = () => {
    const { message, taskSid, updateSelectedMessages } = this.props;
    updateSelectedMessages(taskSid, message);
  }

  render() {
    const { classes, message, taskSid, tools, selectedMessages } = this.props;
    const highlightedMessages = selectedMessages[taskSid] || [];
    const isChecked = (highlightedMessages.filter(msg => msg.index === message.index).length > 0);
    const hideCheckbox = (tools[taskSid]?.currentTool !== '/chat-transfer');

    return (
      <div
        onClick={this.handleClick}
        className={clsx({ [classes.hideCheckbox]: hideCheckbox })}
      >
        {
          isChecked
            ? (<Icon className={classes.checked}>check_circle</Icon>)
            : (<Icon className={classes.unchecked}>radio_button_unchecked</Icon>)
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedMessages: state[REDUX_NAMESPACE].chatTransfer.selectedMessages,
  tools: state[REDUX_NAMESPACE].tools,
});

const mapDispatchToProps = dispatch => ({
  updateSelectedMessages: bindActionCreators(ChatActions.updateSelectedMessages, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageCheckbox));