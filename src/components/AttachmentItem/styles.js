export default theme => ({
  container: {
    width: 'auto',
    maxWidth: '100%',
    border: '1px solid #ccc',
    borderRadius: 4,
    margin: '2px 0',
    overflow: 'hidden'
  },
  btnBase: {
    width: '100%',
    height: '100%'
  },

  texts: {
    color: 'inherit',
    width: 'auto',
    flex: 1,
    padding: '0 8px',
    minWidth: 128
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },

  thumbWrapper: {
    minWidth: 64,
    flexBasis: 64,
    height: 48,
    backgroundColor: '#ccc',
    borderRight: '1px solid #ccc'
  },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%'
  },

  secondaryAction: {
    flexBasis: 32,
    alignSelf: 'center',
    width: 'auto',
    padding: '0 4px 0 0'
  },
  clearBtn: {
    pointerEvents: 'all'
  },
  error: {
    color: '#C0192D'
  }
});
