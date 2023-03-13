import * as React from 'react';
import { connect } from 'react-redux';
import { Manager } from '@twilio/flex-ui';
import { withStyles } from '@material-ui/core';
import styles from './styles';
import Resource from '../../../utils/resource';

const GetCallPropertiesResource = Resource('get-call-properties');

class ParticipantName extends React.Component {
  state = {
    name: ''
  };

  componentDidMount() {
    const { participant, task } = this.props;
    const { callSid } = participant;

    if (participant.participantType === 'customer') {
      this.setState({ name: task.attributes.name });
      return;
    }

    const manager = Manager.getInstance();
    const token = manager.user.token;

    if (callSid) {
      GetCallPropertiesResource.read({
        token: token,
        callSid: callSid
      })
        .then(response => {
          const { message } = response;
          if (message) {
            const name = (message && message.to) || '';
            this.setState({ name });
          }
        });
    }

    // Ye olden way

    // const getCallPropertiesUrl = `https://${serviceBaseUrl}/get-call-properties?token=${token}&callSid=${callSid}`;
    // fetch(getCallPropertiesUrl)
    //   .then(response => response.json())
    //   .then(json => {
    //     if (json) {
    //       const name = (json && json.to) || '';
    //       this.setState({ name });
    //     }
    //   });
  }

  render() {
    const { classes } = this.props;
    return this.props.listMode ? (
      <div className={classes.nameListItem}>{this.state.name}</div>
    ) : (
      <div className={classes.name}>{this.state.name}</div>
    );
  }
}

const mapStateToProps = state => {
  const { serviceBaseUrl } = state.flex.config;

  return {
    serviceBaseUrl
  };
};

export default connect(mapStateToProps)(withStyles(styles)(ParticipantName));
