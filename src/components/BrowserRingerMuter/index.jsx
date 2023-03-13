import React from 'react';

class Muter extends React.Component {
  constructor(props) {
    super(props);

    let muted = localStorage.getItem('RingerMuted');
    muted = muted === 'true' ? true : false;
    localStorage.setItem('RingerMuted', muted);
    this.state = { muted: muted };
  }

  toggleMute() {
    localStorage.setItem('RingerMuted', !this.state.muted);
    this.setState({ muted: !this.state.muted })
  }

  render() {
    return (
      <div>
        <button type="button" onClick={() => this.toggleMute()}>
         { this.state.muted ? 'Unmute' : 'Mute' }
        </button>
      </div>
    );
  }
}

export default Muter;
