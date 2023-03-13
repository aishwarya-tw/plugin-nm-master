import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';
import EmailIcon from '@material-ui/icons/Email';
const EmailToCustomerIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
   
   <EmailIcon  className={className} style={{ fontSize: 60 , color: color}} />
  
  );
};

EmailToCustomerIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

EmailToCustomerIcon.defaultProps = {
  variant: 'white'
};

export default EmailToCustomerIcon;
