import React, { Component } from 'react';
import { Grid, Link, withStyles } from '@material-ui/core';

import clsx from 'clsx';
import styles from './styles';

import AttachmentItem from '../AttachmentItem/';

class BubbleAttachment extends Component {

  constructor(props) {
    super(props);

    const { message, isHistory } = props;
    let { attachments } = isHistory ? message : message.source.attributes;

    let untitledNumber = 1;
    for(const attachment of attachments) {
      if (!attachment.name || attachment.name === '') {
        attachment.name = `Untitled ${untitledNumber}`;
        untitledNumber++;
      }
    }
  }

  state = {
    showAll: false
  };

  render() {
    const { showAll } = this.state;
    const { message, classes, isHistory, direction, messageType } = this.props;

    let { attachments } = isHistory ? message : message.source.attributes;
    attachments.sort((a, b) => a.name.localeCompare(b.name));

    const attachmentComponents = attachments.map((attachment, idx) => {
      return (
        <Grid item xs={12} key={`attachment-${idx}`}>
          <AttachmentItem
            direction={direction}
            messageType={messageType}
            attachment={attachment}
          />
        </Grid>
      );
    });

    return (
      <Grid container direction="column" className={classes.container}>
        <Grid
          item
          xs={12}
          className={clsx(classes.listItem, showAll && classes.expanded)}
        >
          {attachmentComponents}
        </Grid>

        {attachments.length > 2 && (
          <Grid item xs={12} className={classes.expandItem}>
            <Link
              onClick={() => this.setState({ showAll: !showAll })}
              className={classes.expandLink}
            >
              {showAll ? 'Show less' : 'Show more'}
            </Link>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(BubbleAttachment);
