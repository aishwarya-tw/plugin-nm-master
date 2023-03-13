import * as Flex from '@twilio/flex-ui';
import React, { Component } from 'react';
import ToolContent from '../ToolContainer/Content';
import ToolHeader from '../ToolContainer/Header';
import NMInput from '../NMInput';
import NMButton from '../NMButton';
import { Notifications } from '@twilio/flex-ui';
import { GENERAL_ERROR_NOTIFICATION } from '../../utils/constants';
import {
  Grid,
  Paper,
  Typography,
  Link,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
let url;
//Determine which environment we are in
const { account_sid: accountSid } =
  Flex.Manager.getInstance().serviceConfiguration;

if (accountSid === 'AC614ccf8ec78d6f1a6d183b32f3474a33') {
  //Development
  url =
    'https://nmg-enterprise-nonprod.nmgcloud.io/promo-campaign-process-dev/v1/coupon_usage?';
}

if (accountSid === 'ACc133a04a6be60bee3bc21c7272407cd4') {
  // QA
  url =
    'https://nmg-enterprise-nonprod.nmgcloud.io/promo-campaign-process-dev-int/v1/coupon_usage?';
}

if (accountSid === 'ACa01e8ddd02c436753437aba23bd0281f') {
  //PreProd
}

if (accountSid === 'ACdd86b3a7f858f6f4672f54755ce42a7c') {
  //Prod
}
const apiKey = 'UtWx2ROlZm2eE5cdhOhXQa9cO6QDNNqP6dSGvz04';
class CouponLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponCode: '',
      renderTable: false,
      data: {}
    };
  }

  handleChange = event => {
    this.setState({
      couponCode: event.target.value
    });
  };

  handleLookup = async () => {
    let reqURL = url + 'code=' + this.state.couponCode;
    await fetch(reqURL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'x-api-key': apiKey
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res?.message) {
          Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
            errorMessage: `Incorrect Coupon Code`
          });
          return;
        }
        this.setState({
          data: res,
          renderTable: true
        });
      })
      .catch(err => {
        Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
          errorMessage: `Failed to Fetch Coupon Code, Err ` + err
        });
      });
  };

  render() {
    const { taskSid } = this.props;
    const { couponCode, data, renderTable } = this.state;

    return (
      <ToolContent taskSid={taskSid}>
        <ToolHeader
          label={
            <Typography variant="body1">Enter Coupon to Lookup</Typography>
          }
        ></ToolHeader>
        <NMInput
          variant="white"
          placeholder=""
          value={couponCode}
          onChange={this.handleChange}
        />
        <NMButton onClick={this.handleLookup} disabled={couponCode == ''}>
          Lookup
        </NMButton>
        <div>
          <Paper>
            {renderTable ? (
              <Table>
                <TableRow>
                  <TableCell>Coupon Code</TableCell>
                  <TableCell> {data?.value} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Campaign Name</TableCell>
                  <TableCell> {data?.name} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell> {data?.brand[0]} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Coupon Status</TableCell>
                  <TableCell> {data?.couponStatus} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Campaign Start & End Date</TableCell>
                  <TableCell>
                    {' '}
                    {data?.startDate.substring(0, 9)},{' '}
                    {data?.expiryDate.substring(0, 9)}{' '}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Redemption Limit</TableCell>
                  <TableCell> {data?.usageLimit} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Redemption Count</TableCell>
                  <TableCell> {data?.usageCounter} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer Redemption Limit</TableCell>
                  <TableCell> {data?.usageLimit} </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer Redemption Count</TableCell>
                  <TableCell> {data?.profileRedemptionCount} </TableCell>
                </TableRow>
              </Table>
            ) : null}
          </Paper>
        </div>
      </ToolContent>
    );
  }
}
export default CouponLookup;
