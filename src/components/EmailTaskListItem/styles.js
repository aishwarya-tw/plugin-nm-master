export default theme => ({
  container: {
    position: 'relative'
  },
  taskIndicator: {
    '& > div:first-child': {
      paddingRight: 40
    }
  },
  inactiveCustomer: {
    '& > div:first-child': {
      background: 'rgba(0, 156, 255, 0.2)'
    }
  },
  unresponsiveAgent: {
    '& > div:first-child': {
      background: 'rgba(216, 27, 96, 0.05)'
    }
  },
  postponedTask: {
    '& > div:first-child': {
      background: 'rgba(0, 0, 0, 0.05)'
    }
  },
  indicatorIcon: {
    position: 'absolute',
    top: '50%',
    right: 8,
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  }
});
