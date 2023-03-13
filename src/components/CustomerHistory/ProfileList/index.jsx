import React, { Component } from 'react';

import {
  List as MuiList,
  ListItem,
  Typography,
  withStyles
} from '@material-ui/core';

import ToolScrollable from '../../ToolContainer/Scrollable';
import Profile from '../Profile';

import styles from './styles';

class List extends Component {
  render() {
    const { classes, taskSid, profiles, getChubConversationsList } = this.props;

    if (profiles) {
      return (
        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`${taskSid}-profiles`}
        >
          <MuiList className={classes.list}>
            {profiles.map(profile => (
              <ListItem className={classes.item}>
                <Profile
                  profile={profile}
                  getChubConversationsList={getChubConversationsList}
                />
              </ListItem>
            ))}
          </MuiList>
        </ToolScrollable>
      );
    }

    return <Typography variant="subheading">No Profiles Found</Typography>;
  }
}

export default withStyles(styles)(List);
