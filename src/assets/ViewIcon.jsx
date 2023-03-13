import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const ViewIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="22px" height="17px" viewBox="0 0 22 17">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-173.000000, -251.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(174.000000, 252.000000)">
            <g>
              <path d="M0,7.27272727 C0,7.27272727 3.63636364,0 10,0 C16.3636364,0 20,7.27272727 20,7.27272727 C20,7.27272727 16.3636364,14.5454545 10,14.5454545 C3.63636364,14.5454545 0,7.27272727 0,7.27272727 Z"></path>
              <circle cx="10" cy="7.27272727" r="2.72727273"></circle>
            </g>
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
