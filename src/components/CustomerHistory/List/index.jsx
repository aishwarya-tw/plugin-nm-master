import React, { Component } from 'react';

import {
  List as MuiList,
  ListItem,
  Typography,
  withStyles
} from '@material-ui/core';

import ToolScrollable from '../../ToolContainer/Scrollable';
import Item from '../Item';

import styles from './styles';

class List extends Component {
  render() {
    const { classes, taskSid, conversations, onView } = this.props;

    if (conversations && conversations.length > 0) {
      return (
        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`${taskSid}-history`}
        >
          <MuiList className={classes.list}>
            {conversations.map(conversation => (
              <ListItem className={classes.item}>
                <Item conversation={conversation} onView={onView} />
              </ListItem>
            ))}
          </MuiList>
        </ToolScrollable>
      );
    }

    return (
      <Typography variant="subheading" className={classes.noConversations}>
        No conversations founds with the given filters.
      </Typography>
    );
  }
}

export default withStyles(styles)(List);
