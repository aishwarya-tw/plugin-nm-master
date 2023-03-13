import React from 'react';
import PropTypes from 'prop-types';
import { IconVariants } from '../utils/constants';

const AttachIcon = props => {
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
          transform="translate(-22.000000, -161.000000)"
          stroke={color}
          stroke-width="1.5"
        >
          <g transform="translate(23.000000, 162.000000)">
            <path d="M20,9.37599358 L10.5444584,18.2937518 C8.13226768,20.5687494 4.22133378,20.5687494 1.80914305,18.2937518 C-0.603047682,16.0187543 -0.603047682,12.3302545 1.80914305,10.055257 L11.2646846,1.13749873 C12.8728118,-0.379166258 15.480101,-0.37916624 17.0882282,1.13749877 C18.6963553,2.65416377 18.6963553,5.1131636 17.0882282,6.62982863 L7.62239767,15.5475869 C6.8183341,16.3059194 5.51468946,16.3059194 4.71062589,15.5475869 C3.90656231,14.7892544 3.90656231,13.5597545 4.71062589,12.8014219 L13.4459412,4.57263086"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

AttachIcon.propTypes = {
  variant: PropTypes.oneOf(Object.keys(IconVariants))
};

AttachIcon.defaultProps = {
  variant: 'white'
};

export default AttachIcon;
