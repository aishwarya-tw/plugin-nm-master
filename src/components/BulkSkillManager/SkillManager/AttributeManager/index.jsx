import React, { Component } from 'react';
import {
  withStyles,
  Paper,
  FormGroup,
  Checkbox,
  Select,
  Input,
  FormControl,
  FormControlLabel,
  Typography,
  MenuItem,
  ListItemText,
  InputLabel,
  Switch,
} from '@material-ui/core';
import styles from './styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../../../../states/SkillManagerReducer';
import { REDUX_NAMESPACE } from '../../../../utils/constants';

class AttributeManager extends Component {
  constructor(props) {
    super(props);
    this.state = { isTeamManagerToggle: false, isTeamManagerSwitch: false,
                    isOpsManagerToggle: false, isOpsManagerSwitch: false };
  }

  handleTeamManagerSelection = (event) => {
    this.props.updateAttributes({ property: "teamManager", value: event.target.value });
  }

  handleBpoProviderSelection = (event) => {
    this.props.updateAttributes({ property: "bpoProvider", value: event.target.value });
  }

  handleOpsManagerSelection = (event) => {
    this.props.updateAttributes({ property: "opsManager", value: event.target.value });
  }

  handleIsTeamManagerSelection = (isToggled, isSwitched) => {
    let value;
    if (isToggled) {
      value = isSwitched ? "true" : "false";
    } else {
      value = "";
    }
    this.props.updateAttributes({ property: "isTeamManager", value });
  }

  handleIsTeamManagerToggle = (event) => {
    const isSwitched = (event.target.checked && this.state.isTeamManagerSwitch);
    this.setState({
      isTeamManagerToggle: event.target.checked,
      isTeamManagerSwitch: isSwitched
    });
    this.handleIsTeamManagerSelection(event.target.checked, isSwitched);
  }

  handleIsTeamManagerSwitch = (event) => {
    const isToggled = (event.target.checked || this.state.isTeamManagerToggle);
    this.setState({
      isTeamManagerSwitch: event.target.checked,
      isTeamManagerToggle: isToggled
    });
    this.handleIsTeamManagerSelection(isToggled, event.target.checked);
  }
  
  handleIsOpsManagerSelection = (isToggled, isSwitched) => {
    let value;
    if (isToggled) {
      value = isSwitched ? "true" : "false";
    } else {
      value = "";
    }
    this.props.updateAttributes({ property: "isOpsManager", value });
  }

  handleIsOpsManagerToggle = (event) => {
    const isSwitched = (event.target.checked && this.state.isOpsManagerSwitch);
    this.setState({
      isOpsManagerToggle: event.target.checked,
      isOpsManagerSwitch: isSwitched
    });
    this.handleIsOpsManagerSelection(event.target.checked, isSwitched);
  }

  handleIsOpsManagerSwitch = (event) => {
    const isToggled = (event.target.checked || this.state.isOpsManagerToggle);
    this.setState({
      isOpsManagerSwitch: event.target.checked,
      isOpsManagerToggle: isToggled
    });
    this.handleIsOpsManagerSelection(isToggled, event.target.checked);
  }
  
  render() {
    const { teamManagers, bpoProviders, opsManagers, attributes } = this.props;
    const { classes } = this.props;
    const teamManagersList = ["Null", ...teamManagers];
    const opsManagersList = ["Null", ...opsManagers];
    const bpoProvidersList = ["Null", ...bpoProviders];
    return (
      <Paper>
        <Typography className={classes.title}>Attributes</Typography>
        <div className={classes.checkboxSwitch}>
          <FormControlLabel
            label={<Typography variant="overline">Is Team Manager</Typography>}
            classes={classes.checkboxLabel}
            control={
              <Checkbox
                checked={this.state.isTeamManagerToggle}
                color="primary"
                onChange={this.handleIsTeamManagerToggle}
              />
            }
          />
          <Switch
            checked={this.state.isTeamManagerSwitch}
            onChange={this.handleIsTeamManagerSwitch}
            color="primary"
          />
        </div>
        <div className={classes.checkboxSwitch}>
          <FormControlLabel
            label={<Typography variant="overline">Is Ops Manager</Typography>}
            classes={classes.checkboxLabel}
            control={
              <Checkbox
                checked={this.state.isOpsManagerToggle}
                color="primary"
                onChange={this.handleIsOpsManagerToggle}
              />
            }
          />
          <Switch
            checked={this.state.isOpsManagerSwitch}
            onChange={this.handleIsOpsManagerSwitch}
            color="primary"
          />
        </div>
        <FormGroup row className={classes.formGroup}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="team-manager-select" className={classes.inputLabel}>Team Manager</InputLabel>
            <Select
              value={attributes.teamManager}
              onChange={this.handleTeamManagerSelection}
              input={<Input id="team-manager-select" />}
              renderValue={selected => selected}
            >
              <MenuItem value="">
                <ListItemText primary="--No change--" />
              </MenuItem>
              {teamManagersList.map(manager => (
                <MenuItem value={manager}>
                  <ListItemText primary={manager} />  
                </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="ops-manager-select" className={classes.inputLabel}>Ops Manager</InputLabel>
            <Select
              value={attributes.opsManager}
              onChange={this.handleOpsManagerSelection}
              input={<Input id="ops-manager-select" />}
              renderValue={selected => selected}
            >
              <MenuItem value="">
                <ListItemText primary="--No change--" />
              </MenuItem>
              {opsManagersList.map(manager => (
                <MenuItem value={manager}>
                  <ListItemText primary={manager} />  
                </MenuItem>
                ))}
            </Select>
          </FormControl> 
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="bpo-provider-select" className={classes.inputLabel}>BPO Provider</InputLabel>
            <Select
              value={attributes.bpoProvider}
              onChange={this.handleBpoProviderSelection}
              input={<Input id="bpo-provider-select" />}
              renderValue={selected => selected}
            >
              <MenuItem value="">
                <ListItemText primary="--No change--" />
              </MenuItem>
              {bpoProvidersList.map(provider => (
                <MenuItem value={provider}>
                  <ListItemText primary={provider} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  teamManagers: state[REDUX_NAMESPACE].skillManager.filters.teamManager.data,
  opsManagers : state[REDUX_NAMESPACE].skillManager.filters.opsManager.data,
  bpoProviders: state[REDUX_NAMESPACE].skillManager.filters.bpoProvider.data,
  attributes: state[REDUX_NAMESPACE].skillManager.attributeManager,
});

const mapDispatchToProps = (dispatch) => ({
  updateAttributes: bindActionCreators(Actions.updateAttributes, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AttributeManager));