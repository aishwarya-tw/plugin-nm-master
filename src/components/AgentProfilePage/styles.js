export default theme => ({
  root: {
    //flexGrow: 1,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    width: '80%'
  },
  gridHeader: {
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'center'
  },
  paperHeader: {
    padding: theme.spacing.unit * 0.5,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily
  },
  paperBoxes: {
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});
