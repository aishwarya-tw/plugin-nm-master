import React, { Component } from 'react';
import {
  withStyles,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Checkbox,
  Paper,
} from '@material-ui/core';
import styles from './styles';

class AgentList extends Component {
  render() {
    const { classes } = this.props;
    
    return (
      <Paper>
        <List subheader={<ListSubheader>Agents ({this.props.selection.length})</ListSubheader>} className={classes.list}>
          {
            this.props.agents.map(agent => (
              <Agent key={agent.sid} worker={agent} handleOnChange={this.props.handleOnChange} selection={this.props.selection} />
            ))
          }
        </List>
      </Paper>
    );
  }
}

function Agent({worker, handleOnChange, selection}) {
  const { sid, attributes } = worker;

  return (
    <ListItem
      key={sid}
      role={undefined}
      dense
      button
      onClick={() => handleOnChange(sid)}
    >
      <Checkbox
        checked={selection.includes(sid)}
        color="primary"
        disableRipple
      />
      <ListItemText primary={`${attributes.full_name || worker.friendlyName}`} />
    </ListItem>
  );
}

export default withStyles(styles)(AgentList);