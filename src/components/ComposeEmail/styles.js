export default theme => ({
  container: {
    width: '100%',
    minWidth: 0,
    wordBreak: 'break-all',
    border: 1
  },
  filterItems: {
    padding: 40 ,
   
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10
  },
  authorName: {
    fontWeight: 'bold'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: 8
  },
  half: {
    display: 'inline-flex',
    width: 'calc(50% - 16px)'
  }
  
    
});