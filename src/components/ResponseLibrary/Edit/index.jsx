import React, { Component } from 'react';

import { Paper, Typography, Grid, withStyles } from '@material-ui/core';
import styles from './styles';

import NMInput from '../../NMInput';
import NMButton from '../../NMButton';
import ToolScrollable from '../../ToolContainer/Scrollable';

class Edit extends Component {
  render() {
    const {
      response,
      titleExists,
      shortCodeExists,
      handleCheckExistingTitle,
      handleCheckExistingShortCode,
      onEditInputChange,
      onSave,
      onCancel,
      classes
    } = this.props;
    const { title, category, shortCode, body } = response;

    const hasTitle = response.title && response.title !== '';
    const hasCategory = response.category && response.category !== '';
    const hasShortCode = response.shortCode && response.shortCode !== '';
    const hasBody = response.body && response.body !== '';
    const canSave =
      !titleExists &&
      hasTitle &&
      hasCategory &&
      !shortCodeExists &&
      hasShortCode &&
      hasBody;

    return (
      <ToolScrollable className={classes.contentWrapper} scrollKey="edit">
        <Paper elevation={0} className={classes.container}>
          <div className={classes.header}>
            <Typography variant="subtitle1" className={classes.headerText}>
              {response.editOriginalResponse === null ? 'Add' : 'Edit'} Response
            </Typography>
            <NMInput
              label="Title"
              value={title}
              className={classes.title}
              onChange={onEditInputChange('title')}
              onBlur={handleCheckExistingTitle}
              error={titleExists}
              helperText={
                titleExists ? 'A response with this title already exists' : ''
              }
            />
          </div>

          <div className={classes.details}>
            <div className={classes.splitWrapper}>
              <div className={classes.categoryWrapper}>
                <NMInput
                  label="Category"
                  value={category}
                  className={classes.input}
                  onChange={onEditInputChange('category')}
                />
              </div>

              <div className={classes.shortCodeWrapper}>
                <NMInput
                  InputProps={{
                    startAdornment: (
                      <Grid
                        container
                        item
                        alignContent="stretch"
                        className={classes.adornment}
                      >
                        <Typography
                          variant="body2"
                          className={classes.adornmentText}
                        >
                          /
                        </Typography>
                      </Grid>
                    )
                  }}
                  label="Short Code"
                  value={shortCode}
                  className={classes.input}
                  inputProps={{ maxLength: 5 }}
                  onChange={onEditInputChange('shortCode')}
                  onBlur={handleCheckExistingShortCode}
                  error={shortCodeExists}
                  helperText={
                    shortCodeExists
                      ? 'A response with this short code already exists'
                      : ''
                  }
                />
              </div>
            </div>

            <NMInput
              label="Content"
              value={body}
              multiline
              className={classes.body}
              InputProps={{ className: classes.bodyInput }}
              inputProps={{ className: classes.bodyTextarea }}
              onChange={onEditInputChange('body')}
            />
          </div>

          <div className={classes.bottom}>
            <NMButton variant="blue" disabled={!canSave} onClick={onSave}>
              Save
            </NMButton>

            <NMButton
              variant="transparent"
              onClick={onCancel}
              className={classes.cancelBtn}
            >
              Cancel
            </NMButton>
          </div>
        </Paper>
      </ToolScrollable>
    );
  }
}

export default withStyles(styles)(Edit);
