import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const PlayIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="24px" height="24px" viewBox="0 0 24 24">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-345.000000, -80.000000)">
          <g>
            <g transform="translate(45.000000, 52.000000)">
              <g transform="translate(0.000000, 17.000000)">
                <g transform="translate(300.000000, 11.000000)">
                  <g
                    transform="translate(9.081081, 6.486486)"
                    stroke={color}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  >
                    <polygon points="0 0 8.07207207 5.18918919 0 10.3783784"></polygon>
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

PlayIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

PlayIcon.defaultProps = {
  variant: 'white'
};

export default PlayIcon;
