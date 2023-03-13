export default styles =>({

TransferBox:{
    display:'flex',
    border: "0.5px solid black",
    height: "100vh",
    
},
agentCard: {
    display:'flex',
    border : "0.5px solid black"
},
transferTitle: {
width: '272px',
height: '12px',
textAlign: 'center',
fontFamily: 'Open Sans',
fontStyle: 'normal',
fontWeight: 600,
fontSize: '14px',
lineHeight: '16px',
letterSpacing: '1px',
color: '#000000',
flex: 'none',
flexGrow: 1,
},
upperTransferBox:{
    boxSizing: 'border-box',
display: 'flex',
flexDirection: 'column',
alignItems: 'flex-start',
gap: '12px',
width: '150x',
height: '150px',

background: '#FFFFFF',
borderWidth: '0px 1px 1px 1px',
borderStyle: 'solid',
borderColor: '#CCCCCC',
flex: 'none',
order: '0',
flexGrow: '0'
},
transferButton:{
 display: 'flex',
flexDirection: 'row',
justifyContent: 'flex-end',
alignItems: 'flex-start',
padding: '5px 0px 0px',
//width: '288px',
//height: '50px',
background:' #009CFF',
flex: 'none',
order: '0',
flexGrow: '0'
},


})
