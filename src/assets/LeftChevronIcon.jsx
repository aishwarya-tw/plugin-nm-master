import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const LeftChevronIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="6px" height="10px" viewBox="0 0 6 10">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-243.000000, -254.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(244.000000, 255.000000)">
            <g>
              <polyline points="4 8 0 4 4 0"></polyline>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

LeftChevronIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

LeftChevronIcon.defaultProps = {
  variant: 'white'
};

export default LeftChevronIcon;
