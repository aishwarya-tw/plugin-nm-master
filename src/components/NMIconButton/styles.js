import { ButtonVariants } from '../../utils/constants';

export default theme => {
  let styles = {
    btn: {
      width: 'auto',
      height: 'auto',
      padding: 6,
      '& > div': {
        height: '100%',
        width: '100%'
      },
      '& > div > svg': {
        height: 'auto',
        width: 'auto',
        maxHeight: '100%',
        maxWidth: '100%'
      }
    }
  };

  Object.keys(ButtonVariants).forEach(variant => {
    const variantStyles = ButtonVariants[variant];
    styles[variant] = {
      backgroundColor: variantStyles.backgroundColor,
      color: variantStyles.color,
      '&:hover': {
        backgroundColor: variantStyles.hoverBackgroundColor
      },
      '&:disabled': {
        opacity: 0.2,
        backgroundColor: variantStyles.backgroundColor
      },
      '&:disabled:hover': {
        backgroundColor: variantStyles.backgroundColor
      }
    };
  });

  return styles;
};
