import { InputVariants } from '../../utils/constants';

export default theme => {
  let styles = {
    label: {
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontSize: 14
    },
    inputWrapper: {
      padding: 0,
      borderRadius: 4,
      overflow: 'hidden',
      '&::after': {
        content: 'unset'
      },
      '&::before': {
        content: 'unset'
      }
    },
    input: {
      padding: '12px 10px'
    },
    multilineInput: {
      maxWidth: 'calc(100% - 20px)'
    }
  };

  Object.keys(InputVariants).forEach(variant => {
    const variantColor = InputVariants[variant];
    styles[variant] = {
      backgroundColor: variantColor
      // TODO add other state colors
    };
  });

  return styles;
};
