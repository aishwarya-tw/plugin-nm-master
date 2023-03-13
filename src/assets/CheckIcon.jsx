import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const CheckIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="18px" height="13px" viewBox="0 0 18 13">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-457.000000, -253.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(458.000000, 254.000000)">
            <g>
              <polyline points="16 0 5 11 0 6"></polyline>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

CheckIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

CheckIcon.defaultProps = {
  variant: 'white'
};

export default CheckIcon;
