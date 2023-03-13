import React, { Component } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { Button } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import styles from './styles';

import { ButtonVariants } from '../../utils/constants';

class NMButton extends Component {
  render() {
    const { classes, className, variant, ...props } = this.props;

    return (
      <Button
        {...props}
        className={clsx(classes.btn, classes[variant], className)}
      />
    );
  }
}

NMButton.propTypes = {
  variant: PropTypes.oneOf(Object.keys(ButtonVariants))
};

NMButton.defaultProps = {
  variant: 'blue'
};

export default withStyles(styles)(NMButton);
