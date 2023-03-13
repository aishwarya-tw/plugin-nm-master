import { red } from '@material-ui/core/colors';

export default theme => ({
  headerUSPSIcon: {
    height: 32
  },
  headerTrackingText: {
    display: 'inline',
    marginTop: 4,
    marginLeft: 4
  },

  headerExternalLink: {
    fontSize: 16,
    marginLeft: 8,
    textDecoration: 'underline',
    cursor: 'pointer'
  },

  headerSearchText: {
    paddingBottom: 12
  },
  headerSearchInput: {
    flexGrow: 1
  },
  headerSearchBtn: {
    padding: '8px 16px',
    marginLeft: 8
  },

  errorMessage: {
    color: red.A200,
    marginTop: 12
  },

  statusContainer: {
    padding: 12,
    borderBottom: '1px solid #ccc'
  },

  statusDescription: {
    fontSize: 24
  },
  statusAddr: {
    fontSize: 30
  },
  statusDate: {
    fontSize: 20
  },
  statusService: {
    fontSize: 20
  },

  statusOtherItem: {
    marginTop: 12
  },
  statusOtherLabel: {
    fontSize: 14
  },
  statusOtherVal: {
    fontSize: 20
  },

  eventsList: {
    width: '100%'
  },
  eventSubheader: {
    fontWeight: 600,
    '&:not(:first-of-type)': {
      borderTop: '1px solid #ccc'
    }
  }
});
