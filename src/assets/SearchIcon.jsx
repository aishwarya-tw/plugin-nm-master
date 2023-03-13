import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const AddIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="12px" height="12px" viewBox="0 0 12 12">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-1247.000000, -141.000000)"
          stroke={color}
          stroke-width="2"
        >
          <g transform="translate(780.000000, 81.000000)">
            <g>
              <g transform="translate(0.000000, 49.000000)">
                <g transform="translate(468.000000, 12.000000)">
                  <g>
                    <circle
                      cx="4.44444444"
                      cy="4.44444444"
                      r="4.44444444"
                    ></circle>
                    <line
                      x1="10"
                      y1="10"
                      x2="7.58333333"
                      y2="7.58333333"
                    ></line>
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

AddIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

AddIcon.defaultProps = {
  variant: 'white'
};

export default AddIcon;
