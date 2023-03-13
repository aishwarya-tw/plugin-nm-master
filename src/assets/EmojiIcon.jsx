import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const EmojiIcon = props => {
  const { className, variant } = props;
  const color = IconVariants[variant];

  return (
    <svg className={className} width="22px" height="22px" viewBox="0 0 22 22">
      <g
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          transform="translate(-62.000000, -161.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(63.000000, 162.000000)">
            <g>
              <circle cx="10" cy="10" r="10"></circle>
              <path d="M6,12 C6,12 7.5,14 10,14 C12.5,14 14,12 14,12"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
              <line x1="13" y1="7" x2="13.01" y2="7"></line>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

EmojiIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

EmojiIcon.defaultProps = {
  variant: 'white'
};

export default EmojiIcon;
