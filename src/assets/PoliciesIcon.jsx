import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const PoliciesIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="34px" height="42px" viewBox="0 0 34 42">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-138.000000, -59.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(139.000000, 60.000000)">
            <g>
              <path d="M20,0 L4,0 C1.790861,0 0,1.790861 0,4 L0,36 C0,38.209139 1.790861,40 4,40 L28,40 C30.209139,40 32,38.209139 32,36 L32,12 L20,0 Z"></path>
              <polyline points="20 0 20 12 32 12"></polyline>
              <line x1="24" y1="22" x2="8" y2="22"></line>
              <line x1="24" y1="30" x2="8" y2="30"></line>
              <polyline points="12 14 10 14 8 14"></polyline>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

PoliciesIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

PoliciesIcon.defaultProps = {
  variant: 'white'
};

export default PoliciesIcon;
