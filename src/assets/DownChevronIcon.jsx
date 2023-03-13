import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const DownChevronIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="10px" height="6px" viewBox="0 0 10 6">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-291.000000, -256.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(296.000000, 259.000000) scale(1, -1) rotate(90.000000) translate(-296.000000, -259.000000) translate(294.000000, 255.000000)">
            <g>
              <polyline points="4 8 0 4 4 0"></polyline>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

DownChevronIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

DownChevronIcon.defaultProps = {
  variant: 'white'
};

export default DownChevronIcon;
