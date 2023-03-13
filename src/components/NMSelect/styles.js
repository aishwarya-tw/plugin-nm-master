export default theme => ({
  formControl: {
    width: '100%',
    marginTop: 4,
    paddingTop: 24,
    '& fieldset': {
      borderWidth: '1px !important',
      borderColor: '#CCCCCC !important',
      backgroundColor: '#fff !important'
    }
  },
  muiSelect: {
    backgroundColor: 'unset !important',
    paddingRight: 28
  },
  muiIcon: {
    marginRight: 4
  },

  label: {
    transform: 'scale(0.75)',
    color: '#606471',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 14,
    lineHeight: '11px'
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
  }
});
