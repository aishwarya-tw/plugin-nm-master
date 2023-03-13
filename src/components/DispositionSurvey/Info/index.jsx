import React, { Component } from 'react';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core';
import styles from './styles';

import NMInput from '../../NMInput';

class Info extends Component {
  render() {
    const {
      classes,
      selectedRecord,
      customer,
      channel,
      brand,
      onInfoChange,
      loading
    } = this.props;
    customer.name = loading ? ' ' : customer.name;
    customer.email = loading ? ' ' : customer.email;

    return (
      <div className={classes.container}>
        <div className={classes.inputWrapper}>
          <NMInput
            variant="white"
            value={selectedRecord}
            label="Reason for Contact"
            placeholder="Select a reason from the list above"
            disabled={true}
            error={!selectedRecord}
            helperText={
              !selectedRecord && 'Reason for contact must be selected'
            }
          />
        </div>

        <div className={clsx(classes.inputWrapper, classes.half)}>
          <NMInput
            variant="white"
            className={classes.infoBox}
            value={customer.name}
            name="name"
            label="Name"
            onChange={onInfoChange}
            error={!customer.name}
            helperText={!customer.name && 'Customer name must be provided'}
          />
        </div>

        <div className={clsx(classes.inputWrapper, classes.half)}>
          <NMInput
            variant="white"
            className={classes.infoBox}
            value={customer.email}
            name="email"
            label="Email"
            onChange={onInfoChange}
            error={!customer.email}
            helperText={!customer.email && 'Customer email must be provided'}
          />
        </div>

        <div className={clsx(classes.inputWrapper, classes.half)}>
          <NMInput
            variant="white"
            className={classes.infoBox}
            value={channel}
            label="Contact Method"
            disabled={true}
          />
        </div>

        <div className={clsx(classes.inputWrapper, classes.half)}>
          <NMInput
            variant="white"
            className={classes.infoBox}
            value={brand}
            label="Brand"
            disabled={true}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Info);
