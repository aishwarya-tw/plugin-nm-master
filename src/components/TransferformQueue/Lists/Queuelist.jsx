import React, { Component } from 'react';
import styles from './styles';
import { Button, withStyles, List } from '@material-ui/core';
import {
  InputContainer,
  StyledInput
} from '../../AvailableQueuesTab/ContainerComponents';
import { UserCard, Manager, Actions } from '@twilio/flex-ui';
import clsx from 'clsx';
import { Notifications } from '@twilio/flex-ui';
import { GENERAL_ERROR_NOTIFICATION } from '../../../utils/constants';
const manager = Manager.getInstance();
const proactiveSpecialistSkills =
  manager.serviceConfiguration.attributes.NMG.proactiveSpecialistSkills;
const list = require('../BeautyBrands.json');
let brandsList = Object.values(list.Brands);

let queueNameList = [
  'Assist Digital Channels',
  'Brand Webchat',
  'Digital Stylist Chat',
  'Elevated Chat',
  'Holiday Webchat'
];
class Queuelist extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      chosenQueue: [],
      searchQuery: '',
      index: 0,
      queueList: [],
      isHovered: -1
    };
  }
  componentDidMount = () => {
    this._isMounted = true;
    this.fetchQueues();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  fetchQueues = async () => {
    try {
      let specialistSid = '';
      const queueQuery = await manager.insightsClient.map({
        id: 'realtime_statistics_v1',
        mode: 'open_existing'
      });

      let queue = await queueQuery.getItems({
        pageSize: 200
      });
      let queues = queue.items
        .map(item => {
          const {
            sid,
            friendly_name,
            total_available_workers: availableWorkers
          } = item.value;

          if (friendly_name === 'Specialist Webchat') {
            specialistSid = sid;
          }
          return { sid, friendly_name, availableWorkers };
        })
        .filter(item => queueNameList.includes(item.friendly_name))

        .sort((a, b) => {
          return a.friendly_name.localeCompare(b.friendly_name);
        });

      let response = await manager.insightsClient.liveQuery(
        'tr-worker',
        `data.attributes.routing.skills contains 'Specialist'`
      );

      let items = response.getItems();
      let tempWorkers = Object.values(items).filter(
        worker => worker.activity_name === 'Available'
      );

      brandsList.map(brand => {
        // const skill = proactiveSpecialistSkills[brand];

        let skill = '';

        for (const prop in proactiveSpecialistSkills) {
          if (prop.toLowerCase() == brand.toLowerCase()) {
            skill = proactiveSpecialistSkills[prop];
          }
        }

        let availableWorkers = tempWorkers.filter(worker =>
          worker.attributes.routing.skills.includes(skill)
        ).length;
        let friendly_name = brand;
        let sid = specialistSid;
        let isBeautyBrand = true;
        queues.push({ friendly_name, availableWorkers, sid, isBeautyBrand });
      });

      this.setState({
        queueList: queues
      });
    } catch (error) {
      Notifications.showNotification(GENERAL_ERROR_NOTIFICATION, {
        errorMessage: `Error Fetching Queues: ` + error
      });
    }
  };

  handleQueueButton = index => {
    this.setState({
      index: index
    });
  };

  handleChooseQueue = item => {
    if (this._isMounted) {
      this.setState({
        chosenQueue: item
      });
    }
  };
  handleSearchInputChange = event => {
    this.setState({ searchQuery: event.target.value });
  };
  handleIsHovered = index => {
    this.setState({
      isHovered: index
    });
  };
  handleTransfer = async () => {
    let { chosenQueue } = this.state;
    const transferSid = chosenQueue.sid;

    try {
      const queueQuery = await manager.insightsClient.map({
        id: 'realtime_statistics_v1',
        mode: 'open_existing'
      });

      let queues = await queueQuery.getItems({
        pageSize: 200
      });
      const availableWorkers = queues.items.reduce(
        (allQueues, currentQueue) => {
          allQueues[currentQueue.value.sid] =
            currentQueue.value.total_available_workers;
          return allQueues;
        },
        {}
      );
      if (availableWorkers[transferSid] > 0) {
        if (chosenQueue.isBeautyBrand) {
          this.props.transferChat(
            chosenQueue.sid,
            'Specialist Webchat',
            chosenQueue.friendly_name
          );

          return;
        }
        this.props.transferChat(chosenQueue.sid, chosenQueue.friendly_name, '');

        return;
      }
      this.props.handleDisableTransferButton(false);
      Notifications.showNotification('GeneralErrorNotification', {
        errorMessage: `The Queue chosen for transfer is no longer available. To continue the transfer, please select a different Queue.`
      });
    } catch (e) {
      this.props.handleDisableTransferButton(false);
      Notifications.showNotification('GeneralErrorNotification', {
        errorMessage: `Transfer Error ` + e
      });
    }
  };

  render() {
    const { classes, disableTransfer,chosenQueue } = this.props;
    const { queueList, isHovered } = this.state;
    return (
      <div>
        <InputContainer>
          <StyledInput
            placeholder="Search"
            value={this.state.searchQuery}
            onChange={this.handleSearchInputChange}
          />
        </InputContainer>
        <List style={{ maxHeight: 500, overflow: 'auto',paddingTop: '0px' }}>
          {queueList
            .filter(item => {
              if (this.state.searchQuery == '') {
                return queueList;
              } else if (
                item.friendly_name
                  .toLowerCase()
                  .includes(this.state.searchQuery.toLowerCase())
              ) {
                return queueList;
              }
            })
            .map((item, index) => (
              <div
                className={classes.agentCardDisplay}
                //We Use onMouseOver  and onMouseOut to conditionally add the index to our state then use that to render our UserCard
                onMouseOver={() => {
                  this.handleIsHovered(index);
                }}
                onMouseOut={() => {
                  this.handleIsHovered(-1);
                }}
              >
                <Button
                  key={index}
                  disabled={
                    isHovered === index &&
                    item.availableWorkers == 0
                  }
                  className={clsx(classes.agentButton, {
                    [classes.selected]: this.state.index === index
                  })}
                  onClick={() => {
                    this.handleQueueButton(index);
                    this.handleChooseQueue(item);
                  }}
                >
                  {isHovered === index &&
                  item.availableWorkers == 0 ? (
                    <UserCard
                      className={classes.agentCard}
                      firstLine={'No agents available.'}
                      large
                    />
                  ) : (
                    <UserCard
                      id={index}
                      className={classes.agentCard}
                      firstLine={item.friendly_name}
                      large
                    />
                  )}
                </Button>
              </div>
            ))}
        </List>
        <Button
          variant="contained"
          onClick={() => {
            if(chosenQueue == []){
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
export default withStyles(styles)(Queuelist);
