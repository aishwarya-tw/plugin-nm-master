import React from 'react';

class Channel extends React.Component {
  render() {
    const { taskChannelUniqueName, configuredCapacity } = this.props.channel;

    return (
      <li>
        {taskChannelUniqueName} - {configuredCapacity}
      </li>
    );
  }
}

export default Channel;