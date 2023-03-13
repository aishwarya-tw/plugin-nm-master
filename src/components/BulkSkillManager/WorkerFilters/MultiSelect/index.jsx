import React, { Component } from 'react';
import {
  withStyles,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  ListItemText,
  Select,
  Checkbox
} from '@material-ui/core';
import styles from './styles';

class MultiSelect extends Component {
  render() {
    const {
      name,
      items,
      value,
      onChange,
      multiple,
      disabled,
      classes
    } = this.props;
    const id = name.replace(/\s+/g, '-').toLowerCase();

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={`${id}-multi-select`} className={classes.inputLabel}>{name}</InputLabel>
        <Select
          multiple={multiple}
          value={value}
          onChange={onChange}
          input={<Input id={`${id}-multi-select`} disabled={disabled} />}
          renderValue={selected => multiple ? selected.join(', ') : selected}
        >
          {items.map(item => (
            <MenuItem key={item} value={item}>
              {multiple && <Checkbox checked={value.indexOf(item) > -1} />}
              <ListItemText primary={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(MultiSelect);