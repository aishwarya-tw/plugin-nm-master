import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../states/ToolsReducer';

import { ButtonBase, Typography, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import styles from './styles';
import Assets from '../../assets/';
import { TOOLS } from '../../utils/constants';
import CustomerInformation from '../CustomerInformation'
class ToolsMenu extends Component {
  handleClick = tool => {
    const { taskSid, setCurrentTool } = this.props;

    if (tool.external) {
      window.open(tool.path, '_blank', 'noreferrer,noopener');
    } else {
      setCurrentTool(taskSid, tool.path);
    }
  };

  renderToolButtons = () => {
    const { classes,task } = this.props;

    return TOOLS.filter(tool => !tool.hidden).map(tool => {
      const ToolIcon = Assets[tool.icon];

      return (
        
        
      
        <div className={classes.item}>
          <ButtonBase
            className={classes.btn}
            onClick={() => this.handleClick(tool)}
          >
            {ToolIcon && (
              <div className={classes.icon}>
                <ToolIcon variant="blue" />
              </div>
            )}
            <Typography className={classes.label}>
              {tool.label.toUpperCase()}
            </Typography>
          </ButtonBase>
        </div>
        
        
      );
    });
  };

  render() {
    const { classes,task } = this.props;
    const enableCMDPanel = task.attributes.enableCMDPanel
    return <div className={clsx(classes.container, {
      [classes.containerWithPanel]: enableCMDPanel
    })} >{this.renderToolButtons()}</div>;
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentTool: bindActionCreators(Actions.setCurrentTool, dispatch)
});

export default connect(null, mapDispatchToProps)(withStyles(styles)(ToolsMenu));
