import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';

import { Button, withStyles } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/KeyboardArrowLeft';

import styles from './styles';

class TopBar extends Component {
  render() {
    const { taskSid, showToolsMenu, classes } = this.props;

    return (
      <Button
        fullWidth
        onClick={() => showToolsMenu(taskSid)}
        className={classes.button}
      >
        <ArrowIcon className={classes.icon} />
        Back to tools
      </Button>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  showToolsMenu: bindActionCreators(Actions.showToolsMenu, dispatch)
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(TopBar));
