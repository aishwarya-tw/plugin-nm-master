import React, { Component } from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import { HelpOutline as QuestionIcon } from '@material-ui/icons';
import styles from './styles';

class QuickHelp extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Tooltip
          className={classes.helpIcon}
          title={
            <span className={classes.helpInfo}>
              <div>
                When Callbacks are{' '}
                <span className={classes.boldText}>Enabled</span>, you can
                choose one of three types as the default behavior:{' '}
                <span className={classes.boldText}>Simple</span>,{' '}
                <span className={classes.boldText}>
                  Estimated Wait Time (EWT)
                </span>
                , and <span className={classes.boldText}>Queue Depth</span> (how
                many calls are waiting).{' '}
              </div>
              <br />
              <div>
                If EWT or Queue Depth selected, also configure the value for
                that setting in the Queue Depth and EWT properties.
              </div>
              <br />
              <div>
                Set the{' '}
                <span className={classes.boldText}>Offer Repeats Every</span>{' '}
                value to how often you want the callback offer played to the
                caller.
              </div>
              <br />
              <div>
                {' '}
                Set the{' '}
                <span className={classes.boldText}>
                  Offer Stops at Queue Position
                </span>{' '}
                value to indicate when the caller will stop hearing the callback
                offer, based on their place in line.
              </div>
              <br />
              <div>
                When callbacks are enabled, you may override some or all of
                these defaults by configuring an individual queue.
              </div>
            </span>
          }
        >
          <QuestionIcon />
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(QuickHelp);
