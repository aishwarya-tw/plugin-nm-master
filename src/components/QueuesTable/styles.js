export default theme => ({
  root: {
    padding: '12px 12px 12px 0px'
  },

  table: {
    borderCollapse: 'separate',
    '& td': {
      fontSize: 12
    },
    '& th': {
      fontSize: 14
    }
  },
  label: {
    marginRight: 8,
    fontSize: 12
  },
  head: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#fff',
    zIndex: 2
  },
  headerItem: {
    borderBottom: '1px solid #ccc',
    paddingBottom: 8
  }
});
