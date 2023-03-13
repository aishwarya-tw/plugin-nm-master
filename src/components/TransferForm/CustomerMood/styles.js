export default styles => ({
  optionButtonGroup: {
    class:"w3-display-left",
    margin: '0px 15px',
    paddingBottom: '10px',
    
  },
  tabContainer: {
    gap: '10px',
    alignItems: 'stretch'
  },
  optionItem: {
    flex: 1
  },
  option: {
    background: 'white',
    borderRadius: 5,
    flex: 1,
    minHeight: 66,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    background: '#D81B60',
    color: 'white',
  },
  icon: {
    display: 'block',
    margin: '0 auto',
  },
  iconSelected: {
    color: 'white',
  },
  optionText: {
    width: '50%',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: '14px',
    fontWeight: 600,
  },
  clickEnabled: {
    cursor: 'pointer',
  },
});