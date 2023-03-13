import React, { Component } from 'react';

import { Paper, Typography, withStyles } from '@material-ui/core';
import styles from './styles';

import NMIconButton from '../../NMIconButton';
import AddIcon from '../../../assets/AddIcon';
import EditIcon from '../../../assets/EditIcon';
import NMButton from '../../NMButton';
import ToolScrollable from '../../ToolContainer/Scrollable';

class Details extends Component {
  render() {
    const {
      classes,
      response,
      isPersonal,
      onClose,
      onEdit,
      onClick
    } = this.props;
    const { title, body, shortCode, category } = response;

    return (
      <ToolScrollable className={classes.contentWrapper} scrollKey="detail">
        <Paper elevation={0} className={classes.container}>
          <div className={classes.header}>
            <div className={classes.btnWrapper}>
              <NMIconButton
                icon={<AddIcon variant="white" />}
                onClick={() => onClick(response)}
                variant="blue"
                className={classes.addBtn}
              />
            </div>

            <div className={classes.titleWrapper}>
              <Typography variant="h6">{title}</Typography>
            </div>

            {isPersonal && (
              <div className={classes.btnWrapper}>
                <NMIconButton
                  icon={<EditIcon variant="blue" />}
                  variant="transparent"
                  onClick={() => onEdit(response)}
                />
              </div>
            )}
          </div>

          <div className={classes.details}>
            <div className={classes.infoWrapper}>
              <Typography variant="subtitle2" className={classes.category}>
                {category}
              </Typography>
              <Typography variant="subtitle2" className={classes.shortCode}>
                /{shortCode}
              </Typography>
            </div>

            <div className={classes.bodyWrapper}>
              <Typography variant="subtitle2">{body}</Typography>
            </div>
          </div>

          <div className={classes.bottom}>
            <NMButton onClick={() => onClick(response)} variant="blue">
              Add to Chat
            </NMButton>
            <NMButton
              variant="transparent"
              className={classes.closeBtn}
              onClick={onClose}
            >
              Close
            </NMButton>
          </div>
        </Paper>
      </ToolScrollable>
    );
  }
}

export default withStyles(styles)(Details);
