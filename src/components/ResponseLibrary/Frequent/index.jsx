import React, { Component } from 'react';

import { List, ListItem, withStyles } from '@material-ui/core';
import styles from './styles';

import Item from '../Item';
import ToolScrollable from '../../ToolContainer/Scrollable';

class Frequent extends Component {
  render() {
    const { taskSid, responses = [], onView, classes, onClick } = this.props;
    return (
      <ToolScrollable
        className={classes.contentWrapper}
        scrollKey={`${taskSid}-frequent`}
      >
        {responses.length > 0 && (
          <List className={classes.list}>
            {responses &&
              responses.length &&
              responses.map(response => (
                <ListItem className={classes.item}>
                  <Item response={response} onClick={onClick} onView={onView} />
                </ListItem>
              ))}
          </List>
        )}
      </ToolScrollable>
    );
  }
}

export default withStyles(styles)(Frequent);
