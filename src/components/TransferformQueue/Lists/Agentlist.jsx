import React, { Component } from 'react';
import styles from './styles';
import { Button, withStyles, List } from '@material-ui/core';
import {
  TabContainer,
  ItemContainer,
  ItemInnerContainer,
  InputContainer,
  StyledInput,
  WorkerMarginPlaceholder
} from '../../AvailableQueuesTab/ContainerComponents';
import { UserCard, Manager, Actions } from '@twilio/flex-ui';
import { Notifications } from '@twilio/flex-ui';
import { GENERAL_ERROR_NOTIFICATION } from '../../../utils/constants';
import clsx from 'clsx';
const manager = Manager.getInstance();

class AgentList extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      chosenAgent: '',
      agentList: [],
      agentListNames: [],
      agentSidList: [],
      searchQuery: '',
      isHovered: -1,
      transferDisabled: false
    };
  }
  componentDidMount = () => {
    this._isMounted = true;
    this.fetchWorkers();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  fetchWorkers = async () => {
    let agentName = this.props.agentName.toLowerCase();
    try {
      let response = await manager.insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.routing.skills contains 'Chat'`
      );
      let items = response.getItems();
      let filteredItems = Object.values(items)
        //Added Map Function to filter out agents not available. Returns null if agent is offline then filter to filter out null values
        .map(item => {
          const worker_sid = item.worker_sid;
          const full_name = item.attributes.full_name;

          let available = item.activity_name === 'Available' ? true : false;

          return { full_name, worker_sid, available };
        })
        //Filter out the Current Agent from our List
        .filter(i => i.full_name.toLowerCase() != agentName)

        .sort((a, b) => {
          return a.full_name.localeCompare(b.full_name);
        });
      this.setState({ agentList: filteredItems });
    } catch (error) {
      Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
        errorMessage: `Error Fetching Workers: ` + error
      });
    }
  };

  //
  //Using arrow functions will result in proper binding of this. Otherwise throws error
  handleChooseAgent = agent => {
    if (this._isMounted) {
      this.setState({
        chosenAgent: agent
      });
    }
  };
  handleTransfer = async () => {
    let { chosenAgent } = this.state;
    const workerSid = chosenAgent.worker_sid;
    try {
      const agents = await manager.insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.routing.skills contains 'Chat'`
      );
      const agentList = agents.getItems();
      const doubleCheckAgentStatus = agentList[workerSid].activity_name;

      if (doubleCheckAgentStatus === 'Available') {
        this.props.transferChat(chosenAgent.worker_sid, chosenAgent.full_name);

        return;
      }
      this.props.handleDisableTransferButton(false);
      Notifications.showNotification('GeneralErrorNotification', {
        errorMessage: `The Agent chosen for transfer is no longer available. To continue the transfer, please select a different Agent.`
      });
    } catch (e) {
      this.props.handleDisableTransferButton(false);
      Notifications.showNotification('GeneralErrorNotification', {
        errorMessage: `Transfer Error ` + e
      });
    }
  };
  handleAgentButton = index => {
    this.setState({
      index: index
    });
  };
  handleIsHovered = index => {
    this.setState({
      isHovered: index
    });
  };
  handleSearchInputChange = event => {
    this.setState({ searchQuery: event.target.value });
  };
  render() {
    const { classes, disableTransfer } = this.props;
    const { agentList, isHovered,chosenAgent } = this.state;
    return (
      <div>
        <StyledInput
          placeholder="Search"
          value={this.state.searchQuery}
          onChange={this.handleSearchInputChange}
        />
        <List style={{ maxHeight: 500, overflow: 'auto',paddingTop: '0px' }}>
          {agentList
            .filter(agent => {
              if (this.state.searchQuery == '') {
                return agentList;
              } else if (
                agent.full_name
                  .toLowerCase()
                  .includes(this.state.searchQuery.toLowerCase())
              ) {
                return agentList;
              }
            })
            .map((agent, index) => (
              <div
                className={classes.agentCardDisplay}
                onMouseOver={() => {
                  this.handleIsHovered(index);
                }}
                onMouseOut={() => {
                  this.handleIsHovered(-1);
                }}
              >
                <Button
                  key={index}
                  //Conditionally highlight our selected button by comparing indexes
                  className={clsx(classes.agentButton, {
                    [classes.selected]: this.state.index === index
                  })}
                  disabled={isHovered === index && !agent.available}
                  onClick={() => {
                    this.handleAgentButton(index);
                    this.handleChooseAgent(agent);
                  }}
                >
                  {isHovered === index && !agent.available ? 
                  (
                    <UserCard
                      className={classes.agentCard}
                      firstLine={'Agent is unavailable.'}
                      large
                    />
                  ) : (
                    <UserCard
                      id={index}
                      className={classes.agentCard}
                      firstLine={agent.full_name}
                      large
                    />
                  )}
                </Button>
              </div>
            ))}
        </List>
        <Button
          onClick={() => {
            if(chosenAgent==''){
              Notifications.showNotification('GeneralErrorNotification', {
                errorMessage: `Please select a Queue or Agent ` 
              });
              return
            }
            this.props.handleDisableTransferButton(true);
            this.handleTransfer();
          }}
          className={classes.transferButton}
          disabled={disableTransfer}
        >
          Transfer
        </Button>
      </div>
    );
  }
}
export default withStyles(styles)(AgentList);
