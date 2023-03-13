export default theme => ({

    TaskCanvasThemeProps:{
      container: {
        display: 'flex',
        alignItems: 'start',
        padding: '12px 20px',
        position: 'relative',
        width: '50%',
        background: '#ededed'
      },
     
    
    },
    container: {
      display: 'flex',
      alignItems: 'start',
      padding: '12px 20px',
      position: 'relative',
      width: '100%'
    },
    expandableInfo: {
      fontWeight: '400',
       size:"12px",
        lineHeight: "13.8px" 
     },
     expanded: {
      margin: "3px",
     },
    avatar: {
      textAlign: "center",
    },
    address: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '20px 15px 15px',
      gap: '10px',
      
      background: '#FFFFFF',
      borderRadius: '20px',
      flex: 'none',
      order: 1,
      flexGrow: 0,
    },
    year2Date: {
      paddingTop: '0px',
      marginRight: "20px",
      paddingRight: '0px',
      marginTop: '25px',
      marginBottom: '25px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      padding: '20px',
      background: '#FFFFFF',
      borderRadius: '10px',
      flex: 'none',
      order: 0,
      flexGrow: 0,
    },
    life2Date: {
      
      paddingTop: '0px',
      paddingLeft: '10px',
      marginTop: '25px',
      marginBottom: '25px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      padding: '20px',
      background: '#FFFFFF',
      borderRadius: '10px',
      flex: 'none',
      order: 1,
      flexGrow: 0,
    },
    div: {
      width: '100%',
      'box-sizing': 'border-box',
      flexDirection:'row',
      flex: 'inherit',
     },
     h3: {
      margin: '15px 15px',
      height: '18px',
      
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '1vm',
      lineHeight: '18px',
      marginLeft: 5,
      marginBottom: 0,
      color: '#000000',
      /* Inside auto layout */
      flex: 'none',
      order: 0,
      
      flexGrow: 0,
  
    }
  
  });