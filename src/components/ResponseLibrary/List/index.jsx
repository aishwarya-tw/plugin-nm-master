import React, { Component } from 'react';

import clsx from 'clsx';
import {
  List as MuiList,
  ListItem,
  Link,
  Typography,
  withStyles
} from '@material-ui/core';
import styles from './styles';

import Item from '../Item';
import Category from '../Category';
import RightChevronIcon from '../../../assets/RightChevronIcon';
import ToolScrollable from '../../ToolContainer/Scrollable';

class List extends Component {
  renderResponses = () => {
    const {
      taskSid,
      type,
      responses = [],
      selectedCategory,
      onClick,
      onView,
      onEdit,
      onCategorySelected,
      classes,
      chatInputRef
    } = this.props;
    const categoryResponses = responses
      .filter(response => response.category === selectedCategory[type])
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'accent' })
      );

    return (
      <>
        <div className={classes.breadcrumbs}>
          <Link
            component={Typography}
            className={clsx(classes.link, classes.text)}
            onClick={() => onCategorySelected(type, undefined)}
          >
            {type === 'global' ? 'Browse' : 'My Responses'}
          </Link>
          <RightChevronIcon variant="blue" className={classes.icon} />
          <Typography className={classes.text}>
            {selectedCategory[type]}
          </Typography>
        </div>

        <ToolScrollable
          className={classes.contentWrapper}
          scrollKey={`${taskSid}-${type}-responses`}
        >
          <MuiList className={classes.list}>
            {categoryResponses.map(response => (
              <ListItem className={classes.item}>
                <Item
                  onClick={onClick}
                  response={response}
                  onView={onView}
                  onEdit={onEdit}
                  isPersonal={type === 'personal'}
                  chatInputRef={chatInputRef}
                />
              </ListItem>
            ))}
          </MuiList>
        </ToolScrollable>
      </>
    );
  };

  renderCategories = () => {
    const {
      taskSid,
      type,
      responses = [],
      onCategorySelected,
      classes
    } = this.props;
    // Not sure if we should be filtering/sorting on every render...categories don't change much
    // Better place could be in ResponseLibrary/index.jsx on handleTabSelected?
    // I'm picturing this inside a redux store reducer...but tools don't have their own reducers
    const categories = responses.map(response => response.category);
    const dedupedCategories = new Set(categories);
    const sortedCategories = Array.from(dedupedCategories).sort((a, b) => {
      // Works in chrome, the only supported browser for Flex (other browsers may vary)
      return a.localeCompare(b, undefined, { sensitivity: 'accent' });
    });

    return (
      <ToolScrollable
        className={classes.contentWrapper}
        scrollKey={`${taskSid}-${type}-categories`}
      >
        <MuiList className={classes.list}>
          {sortedCategories.map(category => (
            <ListItem
              className={classes.item}
              onClick={() => onCategorySelected(type, category)}
            >
              <Category category={category} />
            </ListItem>
          ))}
        </MuiList>
      </ToolScrollable>
    );
  };

  render() {
    const { type, selectedCategory } = this.props;

    if (selectedCategory && selectedCategory[type]) {
      return this.renderResponses();
    } else {
      return this.renderCategories();
    }
  }
}

export default withStyles(styles)(List);
