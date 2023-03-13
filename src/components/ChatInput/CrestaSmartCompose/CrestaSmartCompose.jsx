import React, {Component} from 'react';
import './CrestaSmartCompose.css';
import { initCrestaConversation } from '../../../utils/cresta';

export class CrestaSmartCompose extends Component {

  componentDidMount() {
    this.input.addEventListener('changed', this.handleChange);
    this.input.addEventListener('clicked', this.handleClick);
    this.input.addEventListener('focused', this.handleFocus);
    this.input.addEventListener('keyDown', this.handleKeyDown);
    this.input.addEventListener('keyPress', this.handleKeyPress);
    this.input.addEventListener('keyUp', this.handleKeyUp);
    this.input.addEventListener('selectionChanged', this.handleSelectionChange);
    this.input.addEventListener('submitted', this.handleSubmitted);
    this.maybeDisableSuggestion();
    initCrestaConversation(this.props.chatChannel.source.sid);
  }

  componentWillUnmount() {
    this.input.removeEventListener('changed', this.handleChange);
    this.input.removeEventListener('clicked', this.handleClick);
    this.input.removeEventListener('focused', this.handleFocus);
    this.input.removeEventListener('keyDown', this.handleKeyDown);
    this.input.removeEventListener('keyPress', this.handleKeyPress);
    this.input.removeEventListener('keyUp', this.handleKeyUp);
    this.input.removeEventListener('selectionChanged', this.handleSelectionChange);
    this.input.removeEventListener('submitted', this.handleSubmitted);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.disableSuggestion !== this.props.disableSuggestion) {
      this.maybeDisableSuggestion();
    }
    if (prevProps.value !== this.props.value && this.props.value !== this.inputValue) {
      this.inputValue = this.props.value;
    }
  }

  maybeDisableSuggestion() {
    if (this.props.disableSuggestion) {
      this.input.disableSuggestion();
    } else {
      this.input.enableSuggestion();
    }
  }

  handleChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  handleFocus = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleKeyDown = (event) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };

  handleKeyUp = (event) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
    }
  };

  handleSelectionChange = (event) => {
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(event);
    }
  };

  handleSubmitted = (event) => {
    if (this.props.onSubmitted) {
      this.props.onSubmitted(event);
    }
  };

  get input() {
    return this.crestaSmartComposeRef.current;
  }

  get inputValue() {
    return this.input.value;
  }

  set inputValue(value) {
    this.input.value = value;
  }

  constructor(props) {
    super(props);

    this.crestaSmartComposeRef = props.inputRef || React.createRef();
  }

  render() {
    return (
      <>
        <cresta-smart-compose
            chat-id={this.props.chatId}
            ref={this.crestaSmartComposeRef}
            disableSuggestion={this.props.disableSuggestion || 'false'}
            disabled={this.props.disabled}
            >
        </cresta-smart-compose>
      </>
    );
  }
}
