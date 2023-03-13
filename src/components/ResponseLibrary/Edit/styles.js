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
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottom: '1px solid #ccc',
    padding: '12px 24px'
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  title: {
    width: '100%'
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    padding: '12px 24px'
  },
  splitWrapper: {
    display: 'flex'
  },
  categoryWrapper: {
    display: 'inline-flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginRight: 12
  },
  shortCodeWrapper: {
    display: 'inline-flex',
    flexDirection: 'column'
  },
  input: {
    marginBottom: 16
  },
  body: {
    wordBreak: 'break-word',
    overflow: 'hidden',
    flexGrow: 1
  },
  bodyInput: {
    height: '100%',
    '& > div': {
      height: '100%'
    }
  },
  bodyTextarea: {
    minHeight: 'calc(100% - 24px)',
    maxHeight: 'calc(100% - 24px)',
    overflow: 'auto'
  },

  bottom: {
    padding: '12px 24px',
    display: 'flex',
    borderTop: '1px solid #ccc'
  },
  cancelBtn: {
    marginLeft: 8
  },
  adornment: {
    userSelect: 'none',
    backgroundColor: '#ccc',
    padding: '0px 8px',
    width: 'auto',
    height: '100%'
  },
  adornmentText: {
    whiteSpace: 'nowrap',
    fontSize: 29
  }
});
