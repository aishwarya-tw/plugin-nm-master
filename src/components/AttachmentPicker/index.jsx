import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import styles from './styles';

import NMIconButton from '../NMIconButton';
import AttachIcon from '../../assets/AttachIcon';

class AttachmentPicker extends Component {
  state = {
    file: ''
  };

  handleOpenPicker = () => {
    this.refs.attachmentPicker.click();
  };

  handleAttachmentSelected = e => {
    const { onAttachmentSelected } = this.props;
    const file = e.target.files[0];
    onAttachmentSelected(file);
    this.setState({ file: '' });
  };

  render() {
    const { disabled, classes } = this.props;

    return (
      <>
        <NMIconButton
          icon={<AttachIcon variant="blue" />}
          variant="transparent"
          onClick={this.handleOpenPicker}
          disabled={disabled}
        />

        <input
          ref="attachmentPicker"
          type="file"
          value={this.state.file}
          onChange={this.handleAttachmentSelected}
          className={classes.input}
          disabled={disabled}
        />
      </>
    );
  }
}

AttachmentPicker.propTypes = {
  onAttachmentSelected: PropTypes.func,
  disabled: PropTypes.bool
};

AttachmentPicker.defaultProps = {
  onAttachmentSelected: undefined,
  disabled: false
};

export default withStyles(styles)(AttachmentPicker);
