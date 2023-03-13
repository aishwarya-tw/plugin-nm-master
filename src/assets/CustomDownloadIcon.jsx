import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
const CustomDownloadIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
   
   <ArrowDownward  className={className} style={{ fontSize: 60 , color: color,}} />
  
  );
};

CustomDownloadIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

CustomDownloadIcon.defaultProps = {
  variant: 'white'
};

export default CustomDownloadIcon;