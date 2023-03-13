import React from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import NMIconButton from '../../NMIconButton';
import ViewIcon from '../../../assets/ViewIcon';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class CustomerProfile extends React.Component {
  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    const { getChubConversationsList, profile } = this.props;
    getChubConversationsList(profile);
  }

  render() {
    const { classes, profile } = this.props;
    return (
      <Paper elevation={0} className={classes.container}>
        <Grid container>
          <Grid container item xs={12}>
            <Grid item xs={1}>
              <Typography className={classes.label}>
                <PersonOutlineIcon className={classes.icon} />
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography className={classes.details}>
                {profile.firstName} {profile.lastName}
              </Typography>
            </Grid>
            <Grid item xs={1} align="right">
              <NMIconButton
                icon={<ViewIcon variant="blue" />}
                variant="transparent"
                onClick={this.handleSelect}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={1}>
              <Typography className={classes.label}>
                <HomeOutlinedIcon className={classes.icon} />
              </Typography>
            </Grid>
            <Grid item xs={10}>
              {profile.addresses.map((address, index) => (
                <div key={'address-' + index} className={classes.address}>
                  <Typography className={classes.details}>{address}</Typography>
                </div>
              ))}
            </Grid>
            <Grid item xs={1} />
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={1}>
              <Typography className={classes.label}>
                <PhoneOutlinedIcon className={classes.icon} />
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography className={classes.details}>
                {profile.phones.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={1}>
              <Typography className={classes.label}>
                <MailOutlineIcon className={classes.icon} />
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography className={classes.details}>
                {profile.emails.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(CustomerProfile);
