import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import queryString from 'query-string';
import styles from './styles';
import Resource from '../../utils/resource';

const PlayVoicemailResource = Resource('play-voicemail');

class VoicemailView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: '',
      source: null,
      recordingDate: ''
    };
  }

  componentDidMount() {
    this.parseQueryParams(this.props);
  }

  parseQueryParams(props) {
    const { flex } = props;
    const queryParams = queryString.parse(window.location.search);
    const recordingDate =
      typeof queryParams.recordingDate !== 'undefined'
        ? queryParams.recordingDate
        : undefined;
    const fileName =
      typeof queryParams.fileName !== 'undefined'
        ? queryParams.fileName
        : undefined;
    const calledNumber =
      typeof queryParams.calledNumber !== 'undefined'
        ? queryParams.calledNumber
        : undefined;
    const fromNumber =
      typeof queryParams.fromNumber !== 'undefined'
        ? queryParams.fromNumber
        : undefined;

    if (fileName) {
      this.setState({
        calledNumber: calledNumber,
        fromNumber: fromNumber,
        recordingDate: recordingDate,
        fileName: fileName,
      });

      PlayVoicemailResource.read({ fileName: fileName })
        .then(res => {
          const audioStream = res.message.data.Body.data;
          const uInt8Array = new Uint8Array(audioStream);
          const blob = new Blob([uInt8Array.buffer]);
          const url = URL.createObjectURL(blob);

          this.setState({ source: url });
        });
    } else {
      flex.Actions.invokeAction('NavigateToView', {
        viewName: 'agent-desktop'
      });
    }
  }

  render() {
    const {
      fileName,
      source,
      recordingDate,
      calledNumber,
      fromNumber
    } = this.state;
    const { classes } = this.props;

    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        {fileName && (
          <>
            <Typography variant="h1" className={classes.headerStyle}>
              Voicemail from: +{fromNumber.trim()}
            </Typography>
            <audio controls controlsList="nodownload" src={source} type="audio/wav" />
            <Typography variant="h7">Recorded on: {recordingDate}</Typography>
            <Typography variant="h7"> For: +{calledNumber.trim()}</Typography>
          </>
        )}
        {!fileName && (
          <Typography variant="h1" className={classes.headerStyle}>
            You have no new voicemails
          </Typography>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(VoicemailView);
