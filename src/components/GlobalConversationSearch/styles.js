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
    },
    '&:nth-of-type(5)': {
      paddingTop:12,
      paddingRight: 6
    },
    '&:nth-of-type(6)': {
      paddingTop:12,
      paddingLeft: 6,
      paddingRight: 6
    },
    '&:nth-of-type(7)': {
      paddingTop:12,
      paddingLeft: 6,
      paddingRight: 6
    },
    '&:nth-of-type(8)': {
      paddingTop:12,
      paddingLeft: 6
    },
    '&:nth-of-type(9)': {
      paddingTop:12,
      paddingRight: 6
    },
    '&:nth-of-type(10)': {
      paddingTop:12,
      paddingLeft: 6,
      paddingRight: 6
    },
    '&:nth-of-type(11)': {
      paddingTop:12,
      paddingLeft: 6
    }
  },
  datePickerInputWrapper: {
    width: '100%'
  },
  textFieldInputWrapper: {
    width: '100%'
  },
  datePickerInput: {
    border: '1px solid #ccc',
    '&::-webkit-calendar-picker-indicator': {
      padding: 0
    }
  },
  datePickerInputLabel : {
    display: 'block',
    color: '#606471',
    letterSpacing: 2,
    fontSize: 11,
    lineHeight: '11px',
    marginBottom: 14,
    marginTop: 2
  },
  textFieldInputLabel: {
    display: 'block',
    color: '#606471',
    letterSpacing: 2,
    fontSize: 11,
    lineHeight: '11px',
    marginBottom: 14,
    marginTop: 2
  },
  toolLabel: {
    color: '#606471',
    fontSize: 13,
    letterSpacing: 2,
    lineHeight: '15px',
    textTransform: 'uppercase',
    marginBottom: 8
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
  }
});
