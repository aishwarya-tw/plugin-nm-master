import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const ExternalLinkIcon = props => {
  const { className, variant = 'blue' } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="18px" height="18px" viewBox="0 0 18 18">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-421.000000, -250.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(422.000000, 251.000000)">
            <g>
              <path d="M13.3333333,8.88888889 L13.3333333,14.2222222 C13.3333333,15.2040618 12.5373951,16 11.5555556,16 L1.77777778,16 C0.795938223,16 0,15.2040618 0,14.2222222 L0,4.44444444 C0,3.46260489 0.795938223,2.66666667 1.77777778,2.66666667 L7.11111111,2.66666667"></path>
              <polyline points="10.6666667 0 16 0 16 5.33333333"></polyline>
              <line x1="6.22222222" y1="9.77777778" x2="16" y2="0"></line>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

ExternalLinkIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

ExternalLinkIcon.defaultProps = {
  variant: 'white'
};

export default ExternalLinkIcon;
