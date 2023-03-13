import {
  FlexBoxColumn,
  FlexBox,
  IconButton,
  getBackgroundWithHoverCSS
} from '@twilio/flex-ui';
import styled from 'react-emotion';
import { Input } from '@material-ui/core';

export const TabContainer = styled(FlexBoxColumn)`
  overflow-x: hidden;
`;

export const ItemContainer = styled(FlexBox)`
  flex-grow: 1;
  overflow-y: auto;
  border-style: solid;
  border-width: 1px 0 0 0;
  ${(props) => props.theme.WorkerDirectory.ItemsContainer}
`;

export const ItemInnerContainer = styled(FlexBox)`
  display: flex;
  padding-left: 0px;
  padding-right: 12px;
  color: inherit;
  outline: none;
  height: 44px;
  background: none;
  border: none;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  position: relative;
  border-color: #d0d0d0;
  ${(props) => props.theme.WorkerDirectory.Item}
  &:hover {
    & .Twilio-WorkerDirectory-ButtonContainer {
      ${(props) => props.available === true ? 'display: flex;' : '' }
    }
    ${(props) =>
      getBackgroundWithHoverCSS(
        props.theme.WorkerDirectory.Item.background,
        props.theme.WorkerDirectory.Item.lightHover,
        true
      )}
    & .Twilio-WorkerDirectory-QueueAvatar {
      ${(props) =>
        getBackgroundWithHoverCSS(
          props.theme.WorkerDirectory.QueueItem.Avatar.background,
          props.theme.WorkerDirectory.Item.lightHover,
          true
        )}
      }
      & .Twilio-WorkerDirectory-AvatarHover {
        ${(props) => props.available === false ? 'display:block;' : '' }        
      }
    }
    .Twilio-WorkerDirectory-AvatarHover {
      display:none;
      position: absolute;
      z-index: 999;
      left:0px;
      top: 1px;
      background: #bebebe;
      padding: 5px 10px;
    }
`;

export const WorkerMarginPlaceholder = styled(FlexBox)`
  width: 6px;
`;

export const ButtonContainer = styled("div")`
  display: none;
`;

export const CallButton = styled(IconButton)`
  margin-right: 8px;
`;

export const InputContainer = styled("div")`
  flex: 0 0 56px;
`;

export const StyledInput = styled(Input)`
  margin-left: 12px;
  margin-top: 10px;
  width: calc(100% - 24px);
`;