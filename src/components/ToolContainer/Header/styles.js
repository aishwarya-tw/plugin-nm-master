export default theme => ({
  container: {
    padding: '16px 0',
    position: 'relative'
  },

  iconItem: {
    padding: '0 12px'
  },

  externalItem: {
    padding: '0 12px'
  },
  externalLink: {
    fontSize: 16,
    marginLeft: 8,
    textDecoration: 'underline',
    cursor: 'pointer'
  },

  inputItem: {
    padding: '16px 12px 0 12px'
  },
  input: {
    flexGrow: 1
  },

  progress: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    width: 'calc(100% - 24px)'
  }
});
