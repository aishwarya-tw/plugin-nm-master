import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';
const ErrorIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];
  return (
    <svg className={className} width="22px" height="22px" viewBox="0 0 22 22">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="All-Icons" transform="translate(-494.000000, -253.000000)">
          <g id="error" transform="translate(494.000000, 251.000000)">
            <g id="Group-5">
              <circle id="Oval" fill={color} cx="7.5" cy="9.5" r="7.5"></circle>
              <text
                font-family="OpenSans-Bold, Open Sans"
                font-size="12"
                font-weight="bold"
                line-spacing="18"
                fill="#FFFFFF"
              >
                <tspan x="6" y="13">
                  !
                </tspan>
              </text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

ErrorIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

ErrorIcon.defaultProps = {
  variant: 'white'
};

export default ErrorIcon;
