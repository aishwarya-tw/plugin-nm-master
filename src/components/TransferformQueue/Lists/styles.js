export default styles => ({
  TransferBox: {
    border: ''
  },
  agentCardDisplay: {
    display: 'flex',
    flexDirection: 'column',
    //alignItems: 'flex-start',
    padding: '0px',
    width: '100%',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    borderBottom: '1px solid grey'
  },
  agentButton: {},
  agentCard: {
    width: '100%',
    display: 'flex',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '14px',
    fontFamily: 'Open Sans',
    letterSpacing: '0.7px',
    color: '#000000',
    flex: 'none',
    order: 1,
    flexGrow: 1
  },
  selected: {
    background: '#FFFFFF'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    //alignItems: 'flex-start',
    padding: '0px 0px 110px',

    width: '326px',
    height: '100vm',
    /* Inside auto layout */
    flex: 'none',
    order: 2,
    flexGrow: 0
  },
  upperTransferBox: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '12px 13px',
    gap: '22px',
    width: '40pw',
    height: '141px',
    background: '#FFFFFF',
    borderWidth: '0px 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    flex: 'none',
    order: '0',
    flexGrow: '0'
  },
  transferButton: {
    width: '',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '3px 0px 0px',
    width: '320px',
    height: '48px',
    background: '#009CFF',
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',

    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.7px',
    textTransform: 'uppercase'
  },
  searchClass: {
    width: '272px',
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '16px',
    textAlign: 'center',
    letterSpacing: '1px',
    color: '#000000',
    flex: 'none',
    flexGrow: 1
  }
});
