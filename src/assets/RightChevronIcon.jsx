import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const RightChevronIcon = props => {
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
          transform="translate(-267.000000, -254.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(270.000000, 259.000000) scale(-1, 1) translate(-270.000000, -259.000000) translate(268.000000, 255.000000)">
            <g>
              <polyline points="4 8 0 4 4 0"></polyline>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

RightChevronIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

RightChevronIcon.defaultProps = {
  variant: 'white'
};

export default RightChevronIcon;
