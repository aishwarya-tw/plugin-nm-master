export default theme => ({
  nmInput: {
    marginTop: 12
  },
  textArea: {
    padding: 0,
    '& textarea:not([aria-hidden="true"])': {
      padding: '12px 10px'
    }
  },
  chatDivider: {
    marginTop: 8
  },
  btnContainer: {
    display: 'flex',
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between'
  },
  sendBtn: {
    minWidth: 36,
    minHeight: 36
  },
  sendIcon: {
    maxHeight: 20,
    maxWidth: 20
  }
});
