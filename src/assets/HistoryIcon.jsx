import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const HistoryIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="42px" height="42px" viewBox="0 0 42 42">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-1003.000000, -134.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(832.000000, 74.000000)">
            <g>
              <g transform="translate(132.000000, 31.000000)">
                <g transform="translate(40.000000, 30.000000)">
                  <g>
                    <circle cx="20" cy="20" r="20"></circle>
                    <polyline points="20 8 20 20 28 24"></polyline>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

HistoryIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

HistoryIcon.defaultProps = {
  variant: 'white'
};

export default HistoryIcon;
