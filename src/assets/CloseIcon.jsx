import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const ViewIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="14px" height="14px" viewBox="0 0 14 14">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-385.000000, -253.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(382.000000, 252.000000)">
            <line x1="16" y1="2" x2="4" y2="14" id="Path"></line>
            <line x1="4" y1="2" x2="16" y2="14" id="Path"></line>
          </g>
        </g>
      </g>
    </svg>
  );
};

ViewIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

ViewIcon.defaultProps = {
  variant: 'white'
};

export default ViewIcon;
