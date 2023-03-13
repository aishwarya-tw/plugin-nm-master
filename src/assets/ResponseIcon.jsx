import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const ResponseIcon = props => {
  const { className, variant = 'blue' } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="38px" height="38px" viewBox="0 0 38 38">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-22.000000, -61.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(23.000000, 62.000000)">
            <g>
              <path d="M36,24 C36,26.209139 34.209139,28 32,28 L8,28 L0,36 L0,4 C0,1.790861 1.790861,0 4,0 L32,0 C34.209139,0 36,1.790861 36,4 L36,24 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

ResponseIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

ResponseIcon.defaultProps = {
  variant: 'white'
};

export default ResponseIcon;
