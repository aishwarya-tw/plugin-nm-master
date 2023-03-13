import React, { Component } from 'react';

import { List as MuiList, ListItem, withStyles } from '@material-ui/core';
import styles from './styles';

import Item from '../../Item';

import ToolScrollable from '../../../ToolContainer/Scrollable';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }
  renderResponses = () => {
    const {
      taskSid,
      type,
      responses,
      onClick,
      onView,
      onEdit,
      classes
    } = this.props;

    return (
      <>
        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`${taskSid}-${type}-responses`}
        >
          <MuiList className={classes.list}>
            {responses.map(response => (
              <ListItem className={classes.item}>
                <Item
                  onClick={onClick}
                  response={response.response}
                  onView={onView}
                  onEdit={onEdit}
                  isPersonal={type === 'personal'}
                />
              </ListItem>
            ))}
          </MuiList>
        </ToolScrollable>
      </>
    );
  };

  render() {
    return this.renderResponses();
  }
}

export default withStyles(styles)(SearchResults);
