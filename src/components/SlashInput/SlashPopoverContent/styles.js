export default theme => ({
  paperRoot: {
    border: '1px solid #CCC',
    borderRadius: 2
  },
  cardHeaderRoot: {
    padding: '6px 4px 6px 12px'
  },
  cardHeaderTitle: {
    fontSize: '0.95em',
    fontWeight: 'bold'
  },
  cardHeaderAction: {
    margin: 0
  },
  actionButtonRoot: {
    fontSize: '0.7em'
  },
  cardContentRoot: {
    padding: '10px 12px',
    backgroundColor: '#E8F1FC',
    '&:last-child': {
      paddingBottom: 10,
    }
  },
  addButtonContainer: {
    margin: '0 16px 0 4px'
  },
  addButton: {
    height: 24,
    width: 24
  },
  responseContainer: {
    // Required to make text overflow ellipsis css work inside flexbox
    minWidth: 0
  },
  responseTitle: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: '0.8em'
  },
  responseBody: {
    display: 'block',
    fontSize: '0.8em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});