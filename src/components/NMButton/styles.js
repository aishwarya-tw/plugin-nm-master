import { ButtonVariants } from '../../utils/constants';

export default theme => {
  let styles = {
    btn: {
      height: 'auto',
      width: 'auto',
      padding: '8px 16px',
      fontSize: 12,
      paddingLeft: 16,
      paddingRight: 16,
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
