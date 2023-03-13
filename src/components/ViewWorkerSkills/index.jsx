import React, { Component } from 'react';

import Skill from './Skill';

class ViewWorkerSkills extends Component {
  render () {
    const { attributes } = this.props.worker;
    let skills = [];
    let disabledSkills = [];

    if (attributes.routing && attributes.routing.skills) {
      skills = attributes.routing.skills;
    }
    if (attributes.disabled_skills && attributes.disabled_skills.skills) {
      disabledSkills = attributes.disabled_skills.skills;
    }

    return (
      <div style={{margin: 12}}>
        <ul>
          {skills.map(skill => (<Skill key={skill} skill={skill} />))}
          {disabledSkills.map(skill => (<Skill disabled key={skill} skill={skill} />))}
        </ul>
      </div>
    );
  }
}

export default ViewWorkerSkills;
