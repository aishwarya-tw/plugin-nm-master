export default theme => ({
  container: {
    flexGrow: 1,
    height: 'calc(100% - 12px)',
    margin: '0 12px 12px 12px',
    display: 'flex',
    flexDirection: 'column'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    padding: '12px 0'
  },
  btnWrapper: {
    width: 64,
    minWidth: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addBtn: {
    width: 32,
    height: 32
  },
  titleWrapper: {
    flexGrow: 1,
    paddingRight: 12
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  infoWrapper: {
    display: 'flex',
    padding: '12px 24px',
    borderBottom: '1px solid #ccc'
  },
  category: {
    paddingRight: 8,
    flexGrow: 1
  },
  shortCode: {
    color: '#999',
    paddingLeft: 8
  },
  bodyWrapper: {
    flexGrow: 1,
    overflow: 'auto',
    padding: '12px 24px',
    wordBreak: 'break-word'
  },

  bottom: {
    padding: '12px 24px',
    display: 'flex',
    borderTop: '1px solid #ccc'
  },
  closeBtn: {
    marginLeft: 8
  }
});
