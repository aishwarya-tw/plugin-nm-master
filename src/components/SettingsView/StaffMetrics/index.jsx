import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Table,
    TableBody, 
    TableCell,  
    TableHead, 
    //TablePagination,
    TableRow, 
    TableSortLabel,
    Toolbar,
    Typography,
    Paper, 
    Tooltip,
    withStyles,
} from '@material-ui/core';
import Resource from '../../../utils/resource';
import { REDUX_NAMESPACE } from '../../../utils/constants';

const getBpoMetricsResouce = Resource('get-bpo-routing-metrics');
let counter = 0;

function createData(agentTeam, occupancy, forecast, actuals, variance, totalAgents, availAgents, tasksInQueue, oldestCallWaiting, activeTasks, asa, capacity, open, openPercent) {
  counter += 1;
  return { id: counter, agentTeam, occupancy, forecast, actuals, variance, totalAgents, availAgents, tasksInQueue, oldestCallWaiting, activeTasks, asa, capacity, open, openPercent };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'agentTeam', numeric: false, disablePadding: true, label: 'Group' },
  { id: 'occupancy', numeric: true, disablePadding: false, label: 'Occupancy' },
  //CALABRIO: Remove below comments when forecast and variance are working
  //{ id: 'forecast', numeric: true, disablePadding: false, label: 'Forecast' },
  { id: 'actuals', numeric: true, disablePadding: false, label: 'Actuals' },
  //{ id: 'variance', numeric: true, disablePadding: false, label: 'Variance' },
  { id: 'totalAgents', numeric: true, disablePadding: false, label: 'Staff' },
  { id: 'availAgents', numeric: true, disablePadding: false, label: 'Available' },
  { id: 'tasksInQueue', numeric: true, disablePadding: false, label: 'In Queue' },
  { id: 'oldestCallWaiting', numeric: true, disablePadding: false, label: 'OCW' },
  { id: 'activeTasks', numeric: true, disablePadding: false, label: 'Active Tasks' },
  { id: 'ASA', numeric: true, disablePadding: false, label: 'ASA' },
  { id: 'capacity', numeric: true, disablePadding: false, label: 'Capacity' },
  { id: 'open', numeric: true, disablePadding: false, label: 'Open' },
  { id: 'openPercent', numeric: true, disablePadding: false, label: 'Open%' },
];

class StaffTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {order, orderBy} = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

StaffTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.light,
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let StaffTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          Performance and Staff RT Metrics 
        </Typography>
      </div>
    </Toolbar>
  );
};

StaffTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

StaffTableToolbar = withStyles(toolbarStyles)(StaffTableToolbar);

const styles = theme => ({
  root: {
    width: '70%',
    marginBottom: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
    marginLeft: theme.spacing.unit * 1,
  },
  table: {
    minWidth: 900,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class StaffTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'id',
    data: [
      createData('Alorica', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Arise', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Internal', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Qualfon', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('CCI', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Telus', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('AloricaSDA', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('AriseSDA', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('InternalSDA', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('QualfonSDA', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('CCISDA', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Chat', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('Email', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      createData('SMS', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ],
    page: 0,
    rowsPerPage: 20,
    bpoMetricsArray: [],
  };

  componentDidMount(){
    this.getBpoMetrics();
    //2.5 minute interval
    const intervalId = setInterval(this.getBpoMetrics, 150000);
    this.setState({ intervalId });
  };

  componentWillUnmount = () => {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
      this.setState({ intervalId: undefined });
    }
  };

  getBpoMetrics = async () => {
    try{
    await getBpoMetricsResouce.read({})
    .then(response => {
      const metricsArray = response.message.Item.Items;
      console.log('Read in new BPO Metrics: ', metricsArray);
      this.setState({bpoMetricsArray: metricsArray});
    })
    .catch(error=>{
      console.error('Failed to get BPO Metrics: ', error);
    })

    let newData = this.state.data;
    console.log('ABC new data', newData);
    for (const item of this.state.bpoMetricsArray){
      for (const element of newData){
        if (element.agentTeam === item.bpoProvider){
          element.occupancy = item.occupancy;
          element.forecast = item.forecast;
          element.actuals = item.actuals;
          element.variance = item.variance;
          element.totalAgents = item.staff;
          element.availAgents = item.avail;
          element.tasksInQueue = item.queue;
          element.oldestCallWaiting = item.ocw;
          element.activeTasks = item.tasks;
          element.asa = item.asa;
          element.capacity = item.capacity;
          element.open = item.open;
          element.openPercent = parseFloat(item.openPercent).toFixed(2);
        }
      }
    } 
    this.setState({ data: newData });
    }catch (e){
      console.error(e)
    }    
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <StaffTableToolbar/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <StaffTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  let teamLabel=(n.agentTeam == "Alorica" || n.agentTeam == "Arise" || n.agentTeam == "Internal" || n.agentTeam == "Qualfon" || n.agentTeam == "CCI" || n.agentTeam == "Telus") ?
                    n.agentTeam+" Voice": n.agentTeam; //n.agentTeam
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {teamLabel}
                      </TableCell>
                      <TableCell align="right">{n.occupancy}</TableCell>
                      {/* CALABRIO: Remove below comments when forecast and variance are working */}
                       {/* <TableCell align="right">{n.forecast}</TableCell> */}
                      <TableCell align="right">{n.actuals}</TableCell>
                      {/* <TableCell align="right">{n.variance}</TableCell> */}
                      <TableCell align="right">{n.totalAgents}</TableCell>
                      <TableCell align="right">{n.availAgents}</TableCell>
                      <TableCell align="right">{n.tasksInQueue}</TableCell>
                      <TableCell align="right">{n.oldestCallWaiting}</TableCell>
                      <TableCell align="right">{n.activeTasks}</TableCell>
                      <TableCell align="right">{n.asa}</TableCell>
                      <TableCell align="right">{n.capacity}</TableCell>
                      <TableCell align="right">{n.open}</TableCell>
                      <TableCell align="right">{n.openPercent}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 50 * emptyRows }}>
                  <TableCell colSpan={11} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <TablePagination
          rowsPerPageOptions={[7, 14, 28]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        /> */}
      </Paper>
    );
  }
}

StaffTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  bpoMetrics: state[REDUX_NAMESPACE].bpoMetrics
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StaffTable));