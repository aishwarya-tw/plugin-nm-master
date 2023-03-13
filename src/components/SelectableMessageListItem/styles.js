export default theme => ({
  content: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flexGrow: 1,
    flexShrink: 1,
  },
  avatarContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flexGrow: 0,
    flexShrink: 1,
  },
  avatar: {
    display: 'flex',
    width: 24,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 18,
    overflow: 'hidden',
    background: 'rgb(237, 237, 237)',
  },
  bubbleContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 440,
    minWidth: 100,
    overflowX: 'hidden',
    marginLeft: 0,
    marginRight: 44,
  },
  myMessage: {
    marginLeft: 'auto',
    marginRight: 0,
  },
  end: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flexGrow: 0,
    flexShrink: 1,
    overflowX: 'hidden',
  },
  read: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    marginLeft: 'auto',
    fontSize: 10,
  }
});