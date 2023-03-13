import React, { Component } from 'react';
import { Paper, Card, CardHeader, Button, CardContent, Grid, withStyles } from '@material-ui/core';
import NMIconButton from '../../NMIconButton';
import AddIcon from '../../../assets/AddIcon';
import styles from './styles';
import PropTypes from 'prop-types';

class SlashPopoverContent extends Component {
  constructor(props) {
    super(props);
    const { width, response } = props;
    this.state = { width, response };
  }

  static getDerivedStateFromProps(props, state) {
    const { width, response } = props;
    const { title, body } = response;
    // Update state if there is width & response
    if (width && title && body) {
      return { width, response };
    }
    // If width or response are undefined, popover should be closing...
    // Don't update state because no width or response while closing causes UI jank
    return null;
  }

  render() {
    const { onInsertResponse, openResponseLibrary, trigger, classes } = this.props;
    const { width, response } = this.state;
    const { title, body } = response;
    const icon = <AddIcon variant="white" />;

    return (
      <div style={{ width }}>
        <Paper square={true} elevation={0} classes={{ root: classes.paperRoot }}>
          <Card>
            <CardHeader
              classes={{
                root: classes.cardHeaderRoot,
                title: classes.cardHeaderTitle,
                action: classes.cardHeaderAction
              }}
              title="Responses"
              action={
                <Button
                  onClick={openResponseLibrary}
                  color="primary"
                  classes={{ root: classes.actionButtonRoot }}>
                  Response Library
                </Button>
              } />
            <CardContent classes={{ root: classes.cardContentRoot }}>
              <Grid container alignItems="center" wrap="nowrap">
                <Grid item>
                  <div className={classes.addButtonContainer}>
                    <NMIconButton
                      className={classes.addButton}
                      onClick={() => onInsertResponse(trigger, response)} 
                      icon={icon}
                      variant="blue" />
                  </div>
                </Grid>
                <Grid item className={classes.responseContainer}>
                  <span className={classes.responseTitle}>{title}</span>
                  <span className={classes.responseBody}>{body}</span>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      </div>
    );
  }
}

SlashPopoverContent.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  response: PropTypes.object,
  trigger: PropTypes.object,
  onInsertResponse: PropTypes.func,
  openResponseLibrary: PropTypes.func
};

SlashPopoverContent.defaultProps = {
  width: undefined,
  response: {},
  trigger: {},
  onInsertResponse: () => {},
  openResponseLibrary: (trigger, response) => {}
};

export default withStyles(styles)(SlashPopoverContent);