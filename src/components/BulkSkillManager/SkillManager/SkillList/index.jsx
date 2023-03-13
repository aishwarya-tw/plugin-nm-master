import React, { Component } from 'react';
import {
  withStyles,
  Switch,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Checkbox,
  Paper,
} from '@material-ui/core';
import styles from './styles';

class SkillList extends Component {
  render() {
    const { classes, skills } = this.props;
    const numOfSkills = Object.entries(skills).filter(skill => skill[1].update).length;

    return (
      <Paper>
        <List subheader={<ListSubheader>Skills ({numOfSkills})</ListSubheader>} className={classes.list}>
          {Object.entries(skills).map(skill => (
            <Skill key={skill} skillState={skill} handleOnChange={this.props.handleOnChange} />
          ))}
        </List>
      </Paper>
    );
  }
}

function Skill({ skillState, handleOnChange }) {
  const [skill, state] = skillState;

  return (
    <ListItem
      key={skill}
      role={undefined}
      dense
      button
      onClick={() => handleOnChange(skill, {...state, update: !state.update})}
    >
      <Checkbox
        checked={state.update}
        color="primary"
        disableRipple
      />
      <ListItemText primary={`${skill}`} />
      <ListItemSecondaryAction>
        <Switch
          checked={state.value}
          onChange={() => handleOnChange(skill, {...state, value: !state.value})}
          name={skill}
          color="primary"
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default withStyles(styles)(SkillList);