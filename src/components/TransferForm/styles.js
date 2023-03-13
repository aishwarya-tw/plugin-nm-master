import './Transfer.css';

export default styles => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0px 20px',
    gap: '30px',
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    width: '100vw',
    height: '100vh',
    background: '#EDEDED',
    /* Inside auto layout */
    flex: 'none',
    order: 1,
    flexGrow: 0,
  },
  h2line: {
    height: '18px',
    padding: '5px',
    fontFamily:  ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '16px',
    lineHeight: '0',
    borderBottom: '2px solid #ccc',
    margin: '15px 15px',

    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,

  },
  h3line: {
    height: '18px',
    padding: '5px',
    fontFamily:  ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '0',
    margin: '15px 15px',

    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,

  },
  h3line2: {
    height: '18px',
    margin: '15px 15px',
    padding: '5px',
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,

  },
  h3: {
    margin: '15px 15px',
    height: '18px',
    fontFamily:  ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',

    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,

  },
  tabContainer: {
    gap: '5px'
  },
  optionButtonGroup: {
    class:"w3-display-left",
    margin: '0px 15px',
    'padding-bottom': '10px'
  },
  row: {
    content: "",
    display: 'flex',
    clear: 'both',
    alignItems:'stretch',
    flex: 'auto'
  },

  column1: {
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontFamily: ' Open Sans',
    height:'90vh',
    overflow: 'auto'
  },
  column2: {
    
    'background-color':'#D8D8D8',
    height:'auto'
  },

  div: {
    width: '100%',
    'box-sizing': 'border-box',
    flexDirection:'row'
   },
   flexChild:{
    flex:1
   },
   flexParent:{
    display: 'flex',
    flexDirection: 'row'
   },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '10px',
    margin: '0px 15px',
    height: '93px',
    background: '#FFFFFF',

    flex: '1',
    order: 1,
    alignSelf: 'auto',
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    border: 'none',
    width: '-webkit-fill-available'
  },
  textArea2: {
    margin: '15px 15px',
    background: '#FFFFFF',
    border: '1px solid #CCC',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    width: '-webkit-fill-available'
  },
  select: {
    margin: '0px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    height: '44px',
    background: '#FFFFFF',
    'margin-bottom': '15px',
    /* Inside auto layout */
    flex: '1',
    order: 1,
    alignSelf: 'stretch',
    flexGrow: 0,
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    border: 'none',
    width: '-webkit-fill-available'
  },
  option: {
    width: '498px',
    height: '11px',
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '13px',
    /* or 81% */
    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    flexGrow: 1,
    width: '-webkit-fill-available'
  },
  optionButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    height: '66px',
    borderRadius: '5px',
    background: 'white',
    padding: '20px',
    marginRight: 4,
    width: 'auto',
    flex: '1',

    /* Inside auto layout */
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
  },
  exitFormButton:{
    alignSelf:'flex-end'
  },
  agentButton: {
    width: '',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '3px 0px 0px',
    width: '288px',
    height: '48px',
    background: '#009CFF',
    /* Inside auto layout */

    color: '#FFFFFF',
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',

    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: '0.7px',
    textTransform: 'uppercase',

    /* Inside auto layout */
  },
  chatBubble: {
    display: 'flex',
    gap: '5px'
  },
  message: {
    background: '#FFFFFF',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 10px 5px',
    gap: '3px',
    width: '142px',
    color: '#000000'
  },
  info: {
    display: 'flex',
    marginBottom: '3px',
    width: '100%'
  },
  sender_num: {
    fontWeight: '600',
    fontSize: '10px',
    lineHeight: '11px',
  },
  time: {
    fontWeight: '400',
    fontSize: '10px',
    lineHeight: '11px',
    textAlign: 'right'
  },
  messagecontainer: {
    display: 'flex',
    gap: '5px',
    flexDirection: 'column',
    margin: '10px',
    'padding-bottom': '100px'
  },
  check: {
    background: '#D81B60',
    borderRadius: '50%',
    color: '#ffffff',
    width: '25px',
    height: '25px',
    textAlign: 'center',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    color: '#000000',
    fontWeight: '600',
    background: '#D9DCE4',
    gap: '1px'    
  },
  user: {
    height: '45px',
    lineHeight: '45px',
    verticalAlign: 'middle',
    paddingLeft: '14px',
    background: '#EDEDED'
  },
  h1right: {
    fontSize: '14px',
    fontWeight: '600',
    'text-align': 'center',
    padding: '12px 13px',
  },
  h2right: {
    fontSize: '13px',
    fontWeight: '600',
    'text-align': 'center',
    padding: '12px 13px',
    borderBottom: '2px solid #ccc',
    'word-spacing': '50px',
    margin: '0px 15px',

  },
  agentButton2: {
    'padding-top': '100px'
  },
  buttonText: {
    'display': 'inline-flex',
    'align-items': 'center',
    padding: '0 24px',
    color: '#000',
    height: '100%',
  },
  buttonIcon: {
    'display': 'inline-flex',
    'align-items': 'center',
    padding: '0 24px',
    color: '#000',
    height: '100%',
    'font-size': '1.5em',
    background: 'rgba(0, 0, 0, 0.1)',
  },
  agentNameCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0px',
    width: '571px',
    height: '44px',
    background: '#FFFFFF',
    /* Inside auto layout */
    flex: 'none',
    order: 1,
    alignSelf:'stretch',
    flexGrow: 0
  },
  agentNameCardDisplay:{
    display: 'flex',
flexDirection: 'column',
alignItems: 'flex-start',
padding: '0px',
gap: '10px',
width: '571px',
height: '18px',
flex: 'none',
order: 0,
flexGrow: 0
  },
  optionButtonLast: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    height: '66px',
    background: '#009CFF',
    width: 'auto',
    flex: '1',
    padding: '5px 0px 0px',
    width: '-webkit-fill-available',
    borderRadius: '0px',
    margin: '4px',
    height: '45px',


    /* Inside auto layout */
    fontFamily: ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    letterSpacing: '0.7px',
    color: 'white'

  },
  expressionText: {
    position: 'absolute',
    bottom: '14px',
  },
  expressionIcon: {
    position: 'absolute',
    top: '14px'
  },

  assignedByColor: {
    
   // background: '#FFFFFF',
   margin: '0px 15px',
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'flex-start',
   padding: '10px',
   height: '35px',
   background: '#FFFFFF',
   'margin-bottom': '15px',
   /* Inside auto layout */
   flex: '1',
   order: 1,
   alignSelf: 'stretch',
   flexGrow: 0,
   fontFamily: ' Open Sans',
   fontStyle: 'normal',
   fontWeight: 600,
   fontSize: '16px',
   lineHeight: '18px',
   color: '#000000',
   border: 'none',
   width: '-webkit-fill-available'
  },

  header: {
    margin: '15px 15px',
    height: '18px',
    fontFamily:  ' Open Sans',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
    padding: '10px',
    color: '#000000',
    /* Inside auto layout */
    flex: 'none',
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0,

  }


})
