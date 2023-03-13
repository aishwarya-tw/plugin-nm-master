export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    position: 'relative',
    width: '100%'
  },

  btnWrapper: {
    width: 64,
    minWidth: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  addIcon: {
    width: 32,
    height: 32
  },

  textWrapper: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingRight: 12
  },
  title: {
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },

  actionBtn: {
    height: 36,
    width: 36
  },
  editBtn: {
    marginBottom: 4
  }
});
