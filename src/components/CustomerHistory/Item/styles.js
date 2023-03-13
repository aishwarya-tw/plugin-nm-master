import { CHANNEL_ICON_COLORS } from '../../../utils/constants';

export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'start',
    padding: '12px 0',
    position: 'relative',
    width: '100%'
  },
  detailsContainer: {
    margin: '0 12px',
    width: 'auto',
    borderRadius: '4px 4px 0 0',
    borderBottom: '2px solid #ccc'
  },

  sideWrapper: {
    width: 56,
    minWidth: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  textWrapper: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingRight: 12
  },
  topText: {
    marginBottom: 14
  },

  iconCircle: {
    borderRadius: '50%',
    width: 30,
    height: 30
  },
  SMSIcon: {
    backgroundColor: CHANNEL_ICON_COLORS.sms
  },
  WEBCHATIcon: {
    backgroundColor: CHANNEL_ICON_COLORS.chat
  },
  EMAILIcon: {
    backgroundColor: CHANNEL_ICON_COLORS.email
  },
  icon: {
    color: '#fff',
    fontSize: 16
  },

  dateTime: {
    color: '#222222',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: '18px',
    marginBottom: 6
  },
  orderNo: {
    color: '#606471',
    fontSize: 13,
    letterSpacing: 2,
    lineHeight: '11px',
    marginBottom: 4
  },
  preview: {
    wordBreak: 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    color: '#1E2935',
    fontSize: 14,
    lineHeight: '17px'
  },
  bottomLabel: {
    textTransform: 'uppercase',
    color: '#606471',
    fontSize: 12,
    letterSpacing: 2,
    lineHeight: '11px',
    marginBottom: 3
  },
  bottomValue: {
    color: '#1E2935',
    fontSize: 13,
    letterSpacing: -0.15,
    lineHeight: '17px',
    marginBottom: 5
  },

  actionBtn: {
    height: 36,
    width: 36
  }
});
