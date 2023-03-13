import React from 'react';
import clsx from 'clsx';
import { withStyles, Grid, Icon } from '@material-ui/core';
import styles from './styles';

const MOOD_1 = 'Happy!';
const MOOD_2 = 'Not great.';
const MOOD_3 = 'Angry!';
const ICON_1 = 'sentiment_very_satisfied';
const ICON_2 = 'sentiment_neutral';
const ICON_3 = 'sentiment_very_dissatisfied';

class MoodOption extends React.Component {
  handleClick = () => {
    const { onClick, value, disabled } = this.props;

    if (!disabled) {
      onClick(value);
    }
  }

  render() {
    const { icon, value, selected, disabled, classes } = this.props;

    const optionStyle = clsx({
      [classes.option]: true,
      [classes.selected]: selected,
      [classes.clickEnabled]: !disabled,
    });
    const iconStyle = clsx({
      [classes.icon]: true,
      [classes.iconSelected]: selected,
    });

    return (
      <Grid item className={classes.optionItem}>
        <div
          onClick={this.handleClick}
          className={optionStyle}
        >
          <Icon className={iconStyle}>{icon}</Icon>
          <div className={classes.optionText}>{value}</div>
        </div>
      </Grid>
    );
  }
}

class CustomerMood extends React.Component {
  render() {
    const { value, onClick, disabled, classes } = this.props;

    return (
      <div className={classes.optionButtonGroup}>
        <Grid container wrap='nowrap' className={classes.tabContainer}>
          <MoodOption
            value={MOOD_1}
            icon={ICON_1}
            onClick={onClick}
            selected={value === MOOD_1}
            classes={classes}
            disabled={disabled}
          />
          <MoodOption
            value={MOOD_2}
            icon={ICON_2}
            onClick={onClick}
            selected={value === MOOD_2}
            classes={classes}
            disabled={disabled}
          />
          <MoodOption
            value={MOOD_3}
            icon={ICON_3}
            onClick={onClick}
            selected={value === MOOD_3}
            classes={classes}
            disabled={disabled}
          />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(CustomerMood);