import React, { Component } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import styles from './styles';
import { ChannelTypes } from '../../utils/constants';
import { Manager } from '@twilio/flex-ui';

let manager = Manager.getInstance();

class ChatHeaderLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: ""
    }
  }
  componentDidMount = () => {
    this.getSDATitle();
  }

  getSDATitle = () => {
    const { task } = this.props;
    const { attributes }= task;
    let toNum = attributes?.to? attributes.to:"";

    const { serviceConfiguration } = manager;
    const { NMG } = serviceConfiguration.attributes;
    const { whisperTones } = NMG;

    if (whisperTones){
      for (const key in whisperTones) {
        if (toNum == whisperTones[key][0]){
          this.setState({label: key});
        }
      }
    }else {
      console.log('no whisperTones defined');
    }
  }

  render() {
    const { classes, task } = this.props;
    const { attributes, queueName } = task;
    const { brand, isPlatinum, channelType, targetQueue } = attributes;

    let label = '';
    if (isPlatinum === 'true' || targetQueue === 'Stanley') {
      label = 'Mobile App';
    } else if (channelType === ChannelTypes.voice) {
      let target = targetQueue ? targetQueue:"";
      label = (target.includes("SDA") || queueName.includes("SDA"))? this.state.label+" -SDA" : queueName;
    } else if (brand) {
      label = brand;
    }
    

    return (
      <div className={classes.container}>
        <Typography className={classes.text}>{label}</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(ChatHeaderLabel);
