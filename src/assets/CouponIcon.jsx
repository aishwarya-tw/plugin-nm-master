import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';
import AttachMoney from '@material-ui/icons/AttachMoney.js';

const couponIcon = props => {
  const { className, variant = 'blue' } = props;
  const color = IconVariants[variant];

  return (
    <AttachMoney  className={className} style={{ fontSize: 60 , color: color}} />
  );
};

couponIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

couponIcon.defaultProps = {
  variant: 'white'
};

export default couponIcon;
