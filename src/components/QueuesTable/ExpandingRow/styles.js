export default theme => ({
  buttonCell: {
    width: 32
  },
  button: {
    padding: 4,
    backgroundColor: '#D1D3D4',
    fontSize: 12
  },
  icon: {
    transition: 'transform 0.2s ease'
  },
  rotateIcon: {
    transform: 'rotateZ(180deg)'
  },

  expandRow: {
    height: 'unset'
  },
  expandCell: {
    border: 'none'
  },
  collapseEntered: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  collapseWrapperInner: {
    padding: 12,
    paddingTop: 0
  },
  row: {
    fontSize: 12
  },
  tableCell: {
    fontSize: 12
  }
});
