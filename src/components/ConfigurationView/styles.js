export default theme => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto'
  },
  brandBar: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'black',
    color: 'white',
    paddingLeft: 10,
    height: 40
  },
  brandBarTrapezoid: {
    height: 62,
    position: 'absolute',
    top: 0,
    right: -14,
    zIndex: 0
  },
  brandBarFont: {
    color: 'white',
    letterSpacing: 1,
    flexGrow: 1
  },
  logo: {
    height: 40,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0
  },
  containerInner: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflow: 'auto'
  },
  defaultItem: {
    padding: 12
  },
  queuesItem: {
    height: '100%',
    overflow: 'auto'
  },
  rootToggle: {
    height: 30
  },
  rootToggleBase: {
    height: 30
  }
});
