import React, { Component } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { TextField, FormLabel, withStyles } from '@material-ui/core';
import styles from './styles';

import { InputVariants } from '../../utils/constants';

class NMInput extends Component {
  render() {
    const {
      classes,
      InputProps,
      inputProps,
      variant,
      label,
      labelClassName,
      ...props
    } = this.props;

    return (
      <>
        {label && (
          <FormLabel className={clsx(classes.label, labelClassName)}>
            {label}
          </FormLabel>
        )}
        <TextField
          {...props}
          variant="filled"
          InputProps={{
            ...InputProps,
            className: clsx(
              classes.inputWrapper,
              classes[variant],
              InputProps && InputProps.className
            )
          }}
          inputProps={{
            ...inputProps,
            autocorrect: 'off',
            autocapitalize: 'off',
            spellcheck: 'false',
            className: clsx(
              classes.input,
              this.props.multiline && classes.multilineInput,
              inputProps && inputProps.className
            )
          }}
        />
      </>
    );
  }
}

NMInput.propTypes = {
  variant: PropTypes.oneOf(Object.keys(InputVariants))
};

NMInput.defaultProps = {
  variant: 'grey'
};

export default withStyles(styles)(NMInput);
