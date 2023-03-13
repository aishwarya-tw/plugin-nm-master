import React, { Component } from 'react';

import { Paper, Typography, ButtonBase, withStyles } from '@material-ui/core';
import styles from './styles';

import RightChevronIcon from '../../../assets/RightChevronIcon';

class Category extends Component {
  render() {
    const { classes, category } = this.props;

    return (
      <Paper elevation={0} className={classes.container}>
        <ButtonBase className={classes.btnBase}>
          <div className={classes.wrapper}>
            <Typography
              variant="subtitle1"
              className={classes.label}
              align="left"
            >
              {category}
            </Typography>
            <RightChevronIcon variant="blue" />
          </div>
        </ButtonBase>
      </Paper>
    );
  }
}

export default withStyles(styles)(Category);
