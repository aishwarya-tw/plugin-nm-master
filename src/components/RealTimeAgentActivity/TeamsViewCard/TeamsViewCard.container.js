import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions as RTActions } from '../../../states/RealTimeAgentActivityReducer';
import TeamsViewCard from './TeamsViewCard';
import { REDUX_NAMESPACE } from '../../../utils/constants';

const mapStateToProps = state => {
  //console.log("MapStateToProps: ", state);
  const { report } = state[REDUX_NAMESPACE].realTimeAgentActivity;
  return { report };
};

const mapDispatchToProps = dispatch => ({
  getAgentData: bindActionCreators(RTActions.getAgentData, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(TeamsViewCard);
