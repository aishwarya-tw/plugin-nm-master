export default theme => ({
  contentWrapper: {
    margin: 12,
    marginTop: 0
  },

  searchIcon: {
    marginRight: 12,
    pointerEvents: 'none'
  },

  panelRoot: {
    overflow: 'hidden',
    border: 'none',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },

    '&:not(:first-of-type) $summaryContent': {
      borderTop: '1px solid #ccc',
      margin: 0,
      padding: '12px 0'
    }
  },
  panelExpanded: {
    margin: 'auto',
    borderBottom: '1px solid #ccc'
  },

  summaryRoot: {
    backgroundColor: '#fff',
    minHeight: 'unset',

    '&$summaryExpanded': {
      border: 'none',
      minHeight: 'unset'
    }
  },
  summaryContent: {
    alignItems: 'center',
    '&$summaryExpanded': {
      margin: '12px 0'
    },
    '& > :last-child': {
      padding: 0
    }
  },
  summaryExpanded: {},

  categoryLabel: {
    flexGrow: 1
  },

  details: {
    paddingTop: 0,
    paddingBottom: 0
  },

  recordsList: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 4,
    overflow: 'hidden'
  },
  recordItemRoot: {
    padding: 0,
    '&$recordItemSelected': {
      backgroundColor: '#E8F1FC'
    }
  },
  recordItemSelected: {
    '& $recordItemTextPrimary': {
      color: '#1976D2'
    }
  },
  recordItemTextRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  recordItemTextPrimary: {
    fontWeight: 'bold',
    fontSize: 14
  },
  recordItemTextSecondary: {
    fontSize: 14
  },
  btnBase: {
    width: '100%',
    height: '100%',
    padding: 12,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },
  recordLabel: {
    display: 'flex',
    alignItems: 'center'
  },
  checkIcon: {
    marginRight: 8
  }
});
