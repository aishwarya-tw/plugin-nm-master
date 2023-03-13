import React, { Component } from 'react';

class OriginLink extends Component {
  render() {
    const { task } = this.props;
    const { conversation_attribute_2: originUrl } = task.attributes.conversations;
    return (
      <a href={originUrl} target="_blank" rel="noopener noreferrer">
        Webpage Origination Details
      </a>
    );
  }
}

export default OriginLink;