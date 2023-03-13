import { CHANNEL_ICON_COLORS } from '../../../utils/constants';

export default theme => ({
  root: {
    margin: 12,
    marginTop: 0,
    overflowX: 'hidden',
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  list: {
    flexFlow: 'row wrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    overflow: 'hidden auto',
    paddingLeft: '3.75%',
    paddingRight: '3.75%',
    paddingBottom: 12,
    display: 'flex',
    position: 'relative'
  },

  message: {
    marginTop: 40,
    marginBottom: 20,
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'row nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1
  },
  inlineMessage: {
    display: 'flex',
    flexFlow: 'column nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1,
    overflowX: 'hidden'
  },
  inlineSep: {
    display: 'flex',
    flexFlow: 'row nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1,
    '& > hr': {
      flex: '1 1 1px',
      margin: 'auto',
      borderColor: 'rgb(204, 204, 204)'
    },
    '& > div': {
      flex: '0 1 auto',
      marginLeft: 12,
      marginRight: 12,
      fontSize: 10,
      letterSpacing: 2,
      color: 'rgb(37, 37, 37)'
    }
  },

  messageListItem: {
    flex: '1 1 100%',
    flexDirection: 'column',
    marginBottom: 0,
    marginTop: 20,
    overflow: 'hidden',
    display: 'flex',
    position: 'relative'
  },
  messageListItemSameDirection: {
    marginTop: 4
  },
  messageListItemContent: {
    display: 'flex',
    flexFlow: 'row nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1
  },

  messageBubbleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 440,
    minWidth: 100,
    overflowX: 'hidden',
    marginLeft: 0,
    marginRight: 44
  },
  messageBubbleWrapperAgent: {
    marginLeft: 'auto',
    marginRight: 0,
    '& $messageBubbleHeader': {
      color: '#fff'
    }
  },
  messageBubble: {
    padding: '5px 12px 8px',
    color: 'rgb(37, 37, 37)',
    background: 'rgb(237, 237, 237)',
    borderRadius: 4,
    marginLeft: 0,
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'column nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1
  },
  messageBubbleSMS: {
    background: CHANNEL_ICON_COLORS.sms,
    color: '#fff'
  },
  messageBubbleWEBCHAT: {
    background: CHANNEL_ICON_COLORS.chat,
    color: '#fff'
  },
  messageBubbleEMAIL: {
    background: CHANNEL_ICON_COLORS.email,
    color: '#fff'
  },
  messageBubbleContent: {
    display: 'flex',
    flexFlow: 'column nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1,
    overflowX: 'hidden'
  },
  messageBubbleHeader: {
    WebkitBoxPack: 'justify',
    justifyContent: 'space-between',
    color: 'rgb(37, 37, 37)',
    display: 'flex',
    flexFlow: 'row nowrap',
    WebkitBoxFlex: 1,
    flexGrow: 1,
    flexShrink: 1
  },
  messageBubbleAuthor: {
    fontSize: 10,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '0 1 auto',
    marginRight: 8,
    fontWeight: 'bold'
  },
  messageBubbleTime: {
    fontSize: 10,
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '0 0 auto'
  },
  messageBubbleBody: {
    marginTop: 3,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 1.54,
    overflowWrap: 'break-word'
  },
  subject: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 1.14,
    letterSpacing: 'normal',
    color: theme.calculated.lightTheme ? '#222' : '#fff',
    marginTop: 8,
    marginBottom: 16
  }
});