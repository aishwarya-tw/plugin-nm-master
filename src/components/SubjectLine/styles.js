export default theme => ({
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
