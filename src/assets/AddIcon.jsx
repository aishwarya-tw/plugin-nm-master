import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const AddIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="10px" height="10px" viewBox="0 0 10 10">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-22.000000, -254.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(23.000000, 255.000000)">
            <g>
              <line x1="4" y1="0" x2="4" y2="8"></line>
              <line x1="0" y1="4" x2="8" y2="4"></line>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

AddIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

AddIcon.defaultProps = {
  variant: 'white'
};

export default AddIcon;
