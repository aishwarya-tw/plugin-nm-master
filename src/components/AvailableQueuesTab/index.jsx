import React from 'react';
import { connect } from 'react-redux';
import { REDUX_NAMESPACE, HiddenQueues, AvailableQueueList } from '../../utils/constants';

import { TabContainer, ItemContainer, InputContainer, StyledInput } from './ContainerComponents';
import DirectoryItem from './DirectoryItem';

class AvailableQueuesTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: "" };
  }

  onTransferClick(queue, options) {
    this.props.invokeTransfer({
      task: queue.task,
      targetSid: queue.value,
      options: options,
    });
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  filteredQueuesList = () => {
    const { searchQuery } = this.state;
    const { queuesList } = this.props;
    let filteredList;
    
    if (searchQuery) {
      filteredList = queuesList.filter(queue => queue.label.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      filteredList = [...queuesList];
    }
    // sorting based on  CCC-1803
    filteredList = AvailableQueueList.reduce(function(result, label) {
      let queueFound = filteredList.find(queue=>queue.label===label);
      if(queueFound !== null && queueFound !== undefined){
        result.push(queueFound);
      }
      return result;
    }, []);

    return filteredList.filter(queue => ![...HiddenQueues, "Everyone", "Unknown Task (Voice)"].includes(queue.label));
  }

  render() {
    return (
      <TabContainer key="custom-directory-container">
        <InputContainer>
          <StyledInput
            placeholder="Search"
            value={this.state.searchQuery}
            onChange={this.handleSearchInputChange}
          />
        </InputContainer>
        <ItemContainer
          key="custom-directory-item-container"
          className="Twilio-WorkerDirectory-Queue"
          vertical
        >
          {this.filteredQueuesList().map((item) => {
            return (
              <DirectoryItem
                item={item}
                key={item.label}
                onTransferClick={this.onTransferClick.bind(this)}
                available={item.available}
              />
            );
          })}
        </ItemContainer>
      </TabContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  queuesList: state[REDUX_NAMESPACE].availableQueues.queuesList,
});

export default connect(mapStateToProps)(AvailableQueuesTab);