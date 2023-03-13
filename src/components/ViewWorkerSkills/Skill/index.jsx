import React from 'react';

import { withStyles } from '@material-ui/core';

import styles from './styles';

class Skill extends React.Component {
  render() {
    const { classes, disabled, skill } = this.props;
    return (
      <li>
        {disabled && (
          <span className={classes.disabled}>
            {skill}
          </span>
        )}
        {!disabled && (
          <p>{skill}</p>
        )}
      </li>
    );
  }
}

export default withStyles(styles)(Skill);