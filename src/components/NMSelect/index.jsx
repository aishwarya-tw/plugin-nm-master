import React, { Component } from 'react';
import clsx from 'clsx';

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  withStyles
} from '@material-ui/core';

import { KeyboardArrowDown as DownArrowIcon } from '@material-ui/icons';

import styles from './styles';

class NMSelect extends Component {
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
      <FormControl className={classes.formControl}>
        {label && (
          <InputLabel className={clsx(classes.label, classes.labelClassName)}>
            {label}
          </InputLabel>
        )}
        <Select
          {...props}
          classes={{
            select: classes.muiSelect,
            icon: classes.muiIcon
          }}
          input={
            <OutlinedInput
              className={clsx(
                classes.inputWrapper,
                classes[variant],
                InputProps && InputProps.className
              )}
              inputProps={{
                ...inputProps,
                autocorrect: 'off',
                autocapitalize: 'off',
                spellcheck: 'false',
                className: clsx(
                  classes.input,
                  inputProps && inputProps.className
                )
              }}
            />
          }
          IconComponent={DownArrowIcon}
        >
          {props.children}
        </Select>
      </FormControl>
    );
  }
}

// NMSelect.propTypes = {
//   variant: PropTypes.oneOf(Object.keys(InputVariants))
// };

// NMSelect.defaultProps = {
//   variant: 'grey'
// };

export default withStyles(styles)(NMSelect);
