import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { Icon, Actions } from '@twilio/flex-ui';
import { REDUX_NAMESPACE } from '../../utils/constants';
import {
  Grid,
  Typography,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanel,
  withStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles';
const listofItems = [
  'Brands',
  //'Current Balance',
  //'Available Credit',
  //'Open Date',
  //'LTD Return Amount',
  //'Disputed Transaction Count',
  'Associate Indicator',
  //'Associate Account',
  'Membership Type',
  'Role',
  'VIP Status',
  'International Address Flag',
  'Latitude',
  'Longitude'
];
class CustomerInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      preferredName: '',
      address: '',
      phone: '',
      email: '',
      postalCode: '',
      country: '',
      brands: 'No Data to Display',
      AvailableCredit: 'No Data to Display',
      OpenDate: 'No Data to Display',
      fullAddress: '',
      city: '',
      state: '',
      userFound: false,
      LTDreturnAmount: 'No Data to Display',
      DisputedTransactionCount: 'No Data to Display',
      AssociateIndicator: 'No Data to  Display',
      AssociateAccount: 'No Data to Display',
      MembershipType: 'No Data to Display',
      Role: 'No Data to Display',
      Status: 'No Data to Display',
      Latitude: 'No Data to Display',
      Longitude: 'No Data to Display',
      CurrentBalance: 'No Data to Display',
      AvailableBalance: 'No Data to Display',
      PreferredFlag: 'No Data to Display',
      CurrentBalance: 'No Data to Display',
      InternationalFlag: 'No Data to Display',
      PrimaryFlag: 'No Data to Display',
      CountryCode: 'No Data to Display'
    };
  }

  handleStorage = () => {
    const { cmdData, task } = this.props;
    let sid = task.taskSid;
    //Data is being returned from an Async call which can be undefined initially
    if (Object.keys(cmdData).length !== 0) {
      let dataObject = cmdData[sid];
      let message = dataObject?.data?.message;

      let data = dataObject?.data?.cmdProfiles[0];

      if (message == 'Retrieved CMD Profiles') {
        let tempFirst =
          data.firstName.length == 0
            ? ' '
            : data.firstName?.charAt(0)?.toUpperCase() +
              data?.firstName?.slice(1)?.toLowerCase();
        let tempLast =
          data.lastName.length == 0
            ? ' '
            : data.lastName?.charAt(0).toUpperCase() +
              data?.lastName.slice(1)?.toLowerCase();
        let tempPref =
          data.preferredName.length == 0 ? ' ' : '(' + data.preferredName + ')';
        let tempAddress =
          typeof data.addresses[0] !== 'string' ? '' : data.addresses[0];
        this.setState({
          firstName: tempFirst,
          lastName: tempLast,
          preferredName: tempPref,
          userFound: true,
          brands: data?.brands[0],
          postalCode: data?.postalCode[0],
          fullAddress: tempAddress,
          MembershipType: data?.membershipType[0],
          Role: data?.role[0],
          Status: data?.VIPStatus,
          address: data?.primaryAddressLine[0],
          AssociateIndicator: data?.associateIndicator,
          OpenDate: data?.emailOpenDate[0],
          country: data?.country[0],
          phone: data?.phones[0],
          email: data?.emails[0],
          country: data?.country[0],
          PrimaryFlag: data?.primaryAddressFlag[0],
          InternationalFlag: data?.internationalAddressFlag[0],
          Latitude: data?.latitude[0],
          Longitude: data?.longitude[0]
        });
        if (typeof this.state.fullAddress === 'string')
          this.handleSplitAddress(this.state.fullAddress);

        return;
      }
      
    }
    this.resetState();
  };
  handleSplitAddress = String => {
    let arr = String.split(',');
    this.setState({
      city: arr[1] + ', ',
      state: arr[2] + ', '
    });
  };
  resetState = () => {
    this.setState({
      firstName: '',
      lastName: '',
      preferredName: '',
      address: '',
      phone: '',
      email: '',
      postalCode: '',
      country: '',
      brands: 'No Data to Display',
      AvailableCredit: 'No Data to Display',
      OpenDate: 'No Data to Display',
      fullAddress: '',
      city: '',
      state: '',
      userFound: false,
      LTDreturnAmount: 'No Data to Display',
      DisputedTransactionCount: 'No Data to Display',
      AssociateIndicator: 'No Data to  Display',
      AssociateAccount: 'No Data to Display',
      MembershipType: 'No Data to Display',
      Role: 'No Data to Display',
      Status: 'No Data to Display',
      Latitude: 'No Data to Display',
      Longitude: 'No Data to Display',
      CurrentBalance: 'No Data to Display',
      AvailableBalance: 'No Data to Display',
      PreferredFlag: 'No Data to Display',
      CurrentBalance: 'No Data to Display',
      InternationalFlag: 'No Data to Display',
      PrimaryFlag: 'No Data to Display',
      CountryCode: 'No Data to Display'
    });
  };
  componentDidMount = () => {
    //CMD Data waits for this listener to get added to the redux store
    window.addEventListener('storage', this.handleStorage);
    //Reruns our storage function everytime a new task is selected.
    Actions.addListener('afterSelectTask', this.handleStorage);
  };

  render() {
    const { classes, task } = this.props;

    const {
      firstName,
      lastName,
      preferredName,
      email,
      phone,
      country,
      address,
      postalCode,
      userFound,
      brands,

      CurrentBalance,
      AvailableCredit,
      AvailableBalance,
      PreferredFlag,
      InternationalFlag,
      PrimaryFlag,
      CountryCode,
      OpenDate,
      LTDreturnAmount,
      DisputedTransactionCount,
      AssociateIndicator,
      AssociateAccount,
      MembershipType,
      Role,
      Status,
      Latitude,
      Longitude,
      city,
      state
    } = this.state;

    let stateObjects = [
      brands,
      //CurrentBalance,
      //AvailableCredit,
      //OpenDate,
      //LTDreturnAmount,
      //DisputedTransactionCount,
      AssociateIndicator,
      //AssociateAccount,
      MembershipType,
      Role,
      Status,
      InternationalFlag,
      Latitude,
      Longitude
    ];

    let dataObject = [];
    for (let i = 0; i < stateObjects.length; i++) {
      dataObject[i] = { name: listofItems[i], value: stateObjects[i] };
    }

    return (
      <Grid
        container
        alignItems="center"
        style={{ padding: 10, display: 'block' }}
      >
        {userFound ? (
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: '#ededef',
              zIndex: 1
            }}
          >
            <Grid item xs={12}>
              <div
                className={`Twilio-Icon Twilio-Icon-DefaultAvatar ${classes.avatar}`}
              >
                <Icon sizeMultiplier={2} icon="DefaultAvatar" />
              </div>
              <br></br>
              <Typography
                variant
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                {firstName + ' ' + lastName + preferredName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                style={{
                  fontWeight: '400',
                  marginTop: 30
                }}
              >
                Ph: {phone == null ? 'No Data to Display' : phone}
              </Typography>
              <Typography style={{ fontWeight: '400' }}>
                Email: {email}
              </Typography>
            </Grid>
            <Grid container spacing={1}>
              <div className={classes.div}>
                <h3 className={classes.h3}>ADDRESS</h3>
                <br></br>
                <Grid item xs={12}>
                  <div className={classes.address}>
                    {address == null ? 'No Data to Display' : address}
                    <br></br>
                    {city == null || state == null || postalCode == null
                      ? ''
                      : city + state + postalCode}
                    <br></br>
                    {country == null ? '' : country}
                  </div>
                </Grid>
              </div>
              {/*
              <Grid item xs={6}>
                <div className={classes.year2Date}>
                  <h2 className={classes.h3}>$0.00</h2>
                  Year to date
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.life2Date}>
                  <h2 className={classes.h3}>$0.00</h2>
                  Life to date
                </div>
              </Grid>
                    */}
            </Grid>
            <hr />
          </div>
        ) : (
          <div
            style={{
              position: 'sticky',
              top: 0,
              background: '#ededef',
              zIndex: 1
            }}
          >
            {' '}
            No CMD Profile Found
          </div>
        )}

        <div style={{}}>
          <div>
            <h3 className={classes.h3}>Current Benefit Level</h3>
            <div
              className={classes.address}
              style={{ borderBottom: '1px solid #CCCCCC' }}
            >
              <p> No Data to Display</p>
            </div>
          </div>
          <div>
            <h3 className={classes.h3}>Additional Information</h3>

            {dataObject.map((item, index) => (
              <ExpansionPanel classes={{ expanded: classes.expanded }}>
                <ExpansionPanelSummary
                  style={{ minHeight: '8px' }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography className={classes.expandableInfo}>
                    {item.name}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: '8px 24px' }}>
                  <Typography>
                    {Object.keys(item).length === 0 ||
                    item.value == null ||
                    item.value.length == 0
                      ? 'No Data to Display'
                      : item.value}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </div>
        </div>
      </Grid>
    );
  }
}

// export default Flex.withTaskContext(
//   connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomerInformation))
// );

const mapStateToProps = (state, ownProps) => ({
  cmdData: state[REDUX_NAMESPACE].cmdProfile
});

export default connect(mapStateToProps)(
  withStyles(styles)(CustomerInformation)
);
