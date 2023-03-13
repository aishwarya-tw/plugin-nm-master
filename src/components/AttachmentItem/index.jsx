import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Flex from '@twilio/flex-ui';

import {
  Grid,
  Typography,
  withStyles,
  CircularProgress,
  ButtonBase,
  MuiThemeProvider
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import defaultTheme from '../../themes/defaultTheme';
import * as Icons from '@material-ui/icons';
import styles from './styles';
import clsx from 'clsx';
import { isImage } from '../../utils/helpers';

import Resource from '../../utils/resource';
const SignedUrlResource = Resource('get-signed-url');

class AttachmentItem extends Component {
  constructor(props) {
    super(props);


    const name  = props.attachment && props.attachment.name ? props.attachment.name : "";
    const label = name.split('.')[0];
    const nameParts = name.split('.');
    const extension = nameParts[nameParts.length - 1];

    this.state = {
      name,
      label,
      extension,
      signedUrl: undefined,
      error: false
    };
  }

  componentDidMount = () => {
    const { attachment } = this.props;

    const self = this;

    SignedUrlResource.read({ s3Key: attachment.s3Key })
      .then(result => self.setState({ signedUrl: result.signedUrl }))
      .catch(error =>
        this.setState({
          error: true
        })
      );
  };

  handleOpen = () => {
    window.open(this.state.signedUrl, '_blank', 'noopener');
  };

  handleClearAttachment = e => {
    e.stopPropagation();
    this.props.onClearAttachment();
    this.setState({ error: false });
  };

  render() {
    const { name, extension, signedUrl, error } = this.state;
    const {
      attachment,
      canDelete,
      isUploading,
      classes,
      className,
      errorProp,
      errorMessage,
      errorIcon
    } = this.props;

    const iconName = isImage(extension) ? 'Photo' : 'InsertDriveFile';
    const Icon = Icons[iconName];
    const hasData = attachment.data;
    const hasThumb = isImage(extension) && (signedUrl || hasData);
    const bgUrl = hasData ? attachment.data : signedUrl;

    return (
      <MuiThemeProvider theme={defaultTheme}>
        <Grid container className={clsx(classes.container, className)}>
          <ButtonBase
            className={classes.btnBase}
            onClick={this.handleOpen}
            disabled={!signedUrl}
          >
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.thumbWrapper}
            >
              {!hasThumb && !error && <Icon />}
              {error && <BrokenImageIcon color="error" />}
              {hasThumb && !error && (
                <div
                  className={classes.thumb}
                  style={{
                    backgroundImage: `url(${bgUrl})`
                  }}
                />
              )}
            </Grid>

            <Grid container className={classes.texts}>
              <Grid container alignItems="center" item xs={12}>
                <Typography
                  variant="body2"
                  className={classes.name}
                  color="inherit"
                >
                  {name}
                </Typography>
              </Grid>
              <Grid container justify="center" alignItems="center">
                {errorProp && errorIcon}
                {errorProp && (
                  <span className={classes.error}>{errorMessage}</span>
                )}
              </Grid>
            </Grid>

            {isUploading && (
              <Grid container className={classes.secondaryAction}>
                <CircularProgress size={28} color="inherit" />
              </Grid>
            )}

            {canDelete && (
              <Grid container className={classes.secondaryAction}>
                <Flex.IconButton
                  icon={<CloseIcon />}
                  onClick={this.handleClearAttachment}
                  onMouseDown={e => e.stopPropagation()}
                  className={classes.clearBtn}
                />
              </Grid>
            )}
          </ButtonBase>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

AttachmentItem.propTypes = {
  attachment: PropTypes.object,
  canDelete: PropTypes.bool,
  onClearAttachment: PropTypes.func
};

AttachmentItem.defaultProps = {
  attachment: undefined,
  canDelete: false,
  onClearAttachment: undefined
};

export default withStyles(styles)(AttachmentItem);
