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
    const { classes,  conversations, onView } = this.props;
   console.log('in list component: ',conversations)
    if (conversations && conversations.length > 0) {
      return (
        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`global-search`}
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
        No conversations found with the given filters.
      </Typography>
    );
  }
}

export default withStyles(styles)(List);
