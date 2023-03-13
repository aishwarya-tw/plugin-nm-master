export default theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'absolute',
    top: 32,
    left: '50%',
    transform: 'translate(-50%)',
    width: 456,
    minWidth: 456
  },
  containerWithPanel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'absolute',
    top: 32,
    left: '68%',
    transform: 'translate(-50%)',
    width: 456,
    minWidth: 456
  },

  item: {
    flexBasis: '33%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
    marginBottom: 8,
    marginTop: 8
  },
  btn: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: 132,
    minHeight: 132,
    maxWidth: 132,
    minWidth: 132,
    borderRadius: 4,
    transition: 'background-color 0.1s ease',
    padding: 12,
    '&:hover': {
      backgroundColor: '#F7F7F7'
    }
  },

  icon: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: '#1976D2',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: '14px',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
