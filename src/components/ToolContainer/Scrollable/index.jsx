import React, { Component } from 'react';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core';
import styles from './styles';

import ScrollManager from '../../ScrollManager';

class Scrollable extends Component {
  render() {
    const { scrollKey, children, classes, className } = this.props;
    return (
      <ScrollManager scrollKey={scrollKey} key={scrollKey}>
        {({ connectScrollTarget, ...props }) => (
          <div
            ref={connectScrollTarget}
            className={clsx(classes.container, className)}
          >
            {children}
          </div>
        )}
      </ScrollManager>
    );
  }
}

export default withStyles(styles)(Scrollable);
