import React, { Component } from 'react';
import TextTruncate from 'react-text-truncate';

import clsx from 'clsx';
import { Paper, Typography, withStyles } from '@material-ui/core';
import styles from './styles';

import NMIconButton from '../../NMIconButton';

import AddIcon from '../../../assets/AddIcon';
import EditIcon from '../../../assets/EditIcon';
import ViewIcon from '../../../assets/ViewIcon';
class Item extends Component {
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  render() {
    const {
      response,
      isPersonal,
      onView,
      onEdit,
      onClick,
      classes
    } = this.props;
    const { title, body } = response;

    return (
      <Paper elevation={0} className={classes.container}>
        <div className={classes.btnWrapper}>
          <NMIconButton
            icon={<AddIcon variant="white" />}
            variant="blue"
            className={classes.addIcon}
            onKeyDown={this.handleKeyPress}
            onClick={() => onClick(response)}
          />
        </div>

        <div className={classes.textWrapper}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Typography variant="subtitle2">
            <TextTruncate
              line={2}
              element="span"
              truncateText="…"
              text={body}
            />
          </Typography>
        </div>

        <div className={classes.btnWrapper}>
          {isPersonal && (
            <NMIconButton
              icon={<EditIcon variant="blue" />}
              variant="transparent"
              onClick={() => onEdit(response)}
              className={clsx(classes.actionBtn, classes.editBtn)}
            />
          )}
          <NMIconButton
            icon={<ViewIcon variant="blue" />}
            variant="transparent"
            onClick={() => onView(response)}
            className={classes.actionBtn}
          />
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Item);
