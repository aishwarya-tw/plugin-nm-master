import React, { Component } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { IconButton } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import styles from './styles';

import { ButtonVariants } from '../../utils/constants';

class NMIconButton extends Component {
  render() {
    const { classes, className, variant, ...props } = this.props;

    return (
      <IconButton
        {...props}
        className={clsx(classes.btn, classes[variant], className)}
      />
    );
  }
}

NMIconButton.propTypes = {
  variant: PropTypes.oneOf(Object.keys(ButtonVariants))
};

NMIconButton.defaultProps = {
  variant: 'blue'
};

export default withStyles(styles)(NMIconButton);
