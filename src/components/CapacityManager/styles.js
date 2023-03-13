export default theme => ({
    secondaryWrapper: {
      display: 'flex',
      flexDirection: 'column'      
    },
    filterBtnsWrapper: {
      display: 'flex'      
    },
    closeBtn: {
      alignSelf: 'flex-end',
      marginBottom: 8,
      marginRight: 4
    },
    clearBtn: {
      marginRight: 4
    },

    saveBtn:{
      alignSelf: 'flex-end',
      height: 28,
      fontSize: 10,      
      letterSpacing: 2           
    },
  
    filterItem: {
      '&:nth-of-type(1)': {
        paddingRight: 6
      },
      '&:nth-of-type(2)': {
        paddingLeft: 6,
        paddingRight: 6
      },
      '&:nth-of-type(3)': {
        paddingLeft: 6,
        paddingRight: 6
      },
      '&:nth-of-type(4)': {
        paddingLeft: 6
      }
    },
    datePickerInputWrapper: {
      width: '100%'
    },
    datePickerInput: {
      border: '1px solid #ccc',
      '&::-webkit-calendar-picker-indicator': {
        padding: 0
      }
    },
    datePickerInputLabel: {
      display: 'block',
      color: '#606471',
      letterSpacing: 2,
      fontSize: 11,
      lineHeight: '11px',
      marginBottom: 14,
      marginTop: 2
    },
  
    toolLabel: {
      color: 'rgb(37, 37, 37)',
      fontSize: 10,
      letterSpacing: 2,      
      textTransform: 'uppercase',
      width:'200%',
      fontWeight: 'bold',         
      borderBottomStyle: 'solid',    
      flexBasis: 'auto',
      flexGrow: 0,
      flexShrink : 0,
      borderBottomWidth: '1px',
      borderBottomColor: 'rgb(204, 204, 204)'
    },
    customerName: {
      color: '#222222',
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: -0.3,
      lineHeight: '33px'
    },
    headerContainer: {
      paddingBottom: 14
    },
    endTasksButton: {
      color: "#eee",
      borderRadius: 0,      
      
      width: '100%',
      backgroundColor: 'rgb(41,118,210, 1)',
      '&:hover': {
        backgroundColor: 'rgb(41,118,210, 1)'
      },
    },
    saveButton: {
      color: "#eee",
      borderRadius: 0,      
      marginRight: 20,
      marginLeft: 50,
      marginTop: 20,
      width: '100%',
      backgroundColor: 'rgb(41,118,210, 1)',
      '&:hover': {
        backgroundColor: 'rgb(41,118,210, 1)'
      },
    },
    resetButton: {
      color: "#454545",
      borderRadius: 0,
      marginRight: 20,
      marginTop: 20,
      width: '100%',
      backgroundColor: 'rgb(37, 37, 37, 0.2)',
      '&:hover': {
        backgroundColor: 'rgb(0, 0, 0, 0.2)'
      },
    }
  });
  