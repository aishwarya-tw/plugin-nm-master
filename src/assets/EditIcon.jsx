import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const EditIcon = props => {
  const { className, variant } = props;
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
          transform="translate(-137.000000, -250.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(138.000000, 251.000000)">
            <g>
              <path d="M6.85714286,2.28571429 L1.52380952,2.28571429 C0.682232762,2.28571429 0,2.96794705 0,3.80952381 L0,14.4761905 C0,15.3177672 0.682232762,16 1.52380952,16 L12.1904762,16 C13.032053,16 13.7142857,15.3177672 13.7142857,14.4761905 L13.7142857,9.14285714"></path>
              <path d="M12.5714286,1.14285714 C13.2026111,0.511674594 14.2259603,0.511674605 14.8571428,1.14285717 C15.4883254,1.77403973 15.4883254,2.79738885 14.8571429,3.42857143 L7.61904762,10.6666667 L4.57142857,11.4285714 L5.33333333,8.38095238 L12.5714286,1.14285714 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

EditIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

EditIcon.defaultProps = {
  variant: 'white'
};

export default EditIcon;
