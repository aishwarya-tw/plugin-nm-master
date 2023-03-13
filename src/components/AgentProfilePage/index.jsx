import React, { Component } from 'react';

import { Grid, withStyles, Paper, Typography } from '@material-ui/core';
import styles from './styles';
import { connect } from 'react-redux';
import { Manager } from '@twilio/flex-ui';

import {
  REDUX_NAMESPACE,
} from '../../utils/constants';

import SkillsTable from './SkillsTable';
import ChannelsTable from './ChannelsTable'

let manager = Manager.getInstance();

class AgentProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: manager?.workerClient?.attributes?.routing?.skills, //array
      channels: manager?.workerClient?.channels, //[0-8].capacity
      status: manager?.workerClient?.activity?.name,
      image: manager?.workerClient?.attributes?.image_url,
      fullName: manager?.workerClient?.attributes?.full_name
    }
  }

  // componentDidMount(){
  //   Actions.addListener('afterSetActivity', event => {
  //     console.log("afterSetActivity event:", event)
  //     this.setState({status : event.activityName});
  //   });
  // }

  // componentWillUnmount(){
  //   // TODO convert this to .removeListener
  //   Actions.removeAllListeners('afterSetActivity', () => {
  //     console.log("ALL afterSetActivity listeners removed")
  //   });
  // }
  
  render() {
    const { classes } = this.props;   
    return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Paper className={classes.paperHeader}>
              {/* <UserCard
                  firstLine={this.state.fullName || ""}
                  secondLine={this.state.status || ""}
                  isAvailable={this.state.status === "Available" ? true : false}
                  imageUrl={this.state.image || ""}
                  large="true"
                  ></UserCard> */}
                <Typography variant="h6">
                  AGENT PROFILE
                </Typography>
                
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paperBoxes}><SkillsTable/></Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paperBoxes}><ChannelsTable/></Paper>
            </Grid>
          </Grid>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
    agentProfile: state[REDUX_NAMESPACE].agentProfilePage
  });
  
  const mapDispatchToProps = dispatch => ({});
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AgentProfilePage));