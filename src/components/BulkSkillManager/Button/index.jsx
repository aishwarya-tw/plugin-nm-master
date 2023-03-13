import React, { Component } from 'react';
import NMButton from '../../NMButton';

class Button extends Component {
  render() {
    return (
      <div style={{ marginRight: 16 }}>
        <NMButton variant="blue" onClick={this.props.onClick} disabled={this.props.disabled}>
          {this.props.text}
        </NMButton>
      </div>
    );
  }
}

export default Button;