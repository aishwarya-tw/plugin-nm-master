import React, { Component } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { Grid, LinearProgress, withStyles } from '@material-ui/core';
import styles from './styles';

class Header extends Component {
  render() {
    const {
      label,
      secondaryAction,
      input: Input,
      loading,
      classes,
      className
    } = this.props;

    return (
      <div className={className}>
        <Grid container item xs={12} className={classes.container}>
          <Grid
            container
            alignItems="flex-start"
            item
            xs={6}
            className={classes.iconItem}
          >
            {label && label}
          </Grid>

          <Grid
            container
            alignItems="center"
            justify="flex-end"
            item
            xs={6}
            className={classes.externalItem}
          >
            {secondaryAction && secondaryAction}
          </Grid>

          {Input && (
            <Grid
              container
              alignItems="center"
              item
              xs={12}
              className={classes.inputItem}
            >
              <Grid container item xs={12}>
                <Input.type
                  {...Input.props}
                  className={clsx(Input.props.className, classes.input)}
                />
              </Grid>
            </Grid>
          )}
          

          {loading && <LinearProgress className={classes.progress} />}
        </Grid>
      </div>
    );
  }
}

Header.propTypes = {
  label: PropTypes.element,
  secondaryAction: PropTypes.element,
  input: PropTypes.element
};

export default withStyles(styles)(Header);
