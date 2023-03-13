export default theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 'calc(100% - 8px)',
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 999999
  },
  header: {
    color: '#ccc'
  },
  btn: {
    height: 36,
    fontSize: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#ccc',
    marginTop: 8,
    '&:hover': {
      backgroundColor: '#aaa'
    }
  }
});
