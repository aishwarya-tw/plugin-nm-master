import React, { Component } from 'react';

import clsx from 'clsx';
import { Popover, IconButton, Grid, withStyles } from '@material-ui/core';
import styles from './styles';

import NMIconButton from '../NMIconButton';
import EmojiIcon from '../../assets/EmojiIcon';

import { EMOJI_LIST } from '../../utils/constants';

class EmojiPicker extends Component {
  state = {
    anchorEl: null
  };

  handleOpen = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleEmojiSelected = emoji => {
    this.props.onEmojiSelected(emoji);
    this.handleClose();
  };

  render() {
    const { disabled, classes, className } = this.props;
    const { anchorEl } = this.state;
    const isOpen = Boolean(anchorEl);
    const emojiGridItems = EMOJI_LIST.map((emoji, idx) => (
      <IconButton
        key={'emoji-' + idx}
        onClick={() => this.handleEmojiSelected(emoji)}
        className={classes.emojiIcon}
      >
        {emoji}
      </IconButton>
    ));

    return (
      <React.Fragment>
        <NMIconButton
          icon={<EmojiIcon variant="blue" />}
          variant="transparent"
          disabled={disabled}
          className={clsx(classes.btn, className)}
          onClick={this.handleOpen}
        />

        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.container}
          >
            {emojiGridItems}
          </Grid>
        </Popover>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(EmojiPicker);
