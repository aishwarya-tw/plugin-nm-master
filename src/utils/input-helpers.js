import { SLASH_SEARCH_REGEX } from './constants';

export function getSlashTriggers(inputText) {
  let tempExecResult;
  let matches = [];
  while((tempExecResult = SLASH_SEARCH_REGEX.exec(inputText)) !== null) {
    const match = tempExecResult[0];
    const { index } = tempExecResult;
    matches.push({
      shortCode: match.replace('/', ''),
      start: index,
      end: index + match.length
    });
  }
  return matches;
}

export function getCursorSlashTrigger(slashTriggers, selectionStart, selectionEnd) {
  return slashTriggers.find(trigger => {
    const { start, end } = trigger;
    const goodStart = selectionStart >= start && selectionStart <= end;
    const goodEnd = selectionEnd >= start && selectionEnd <= end;
    return goodStart && goodEnd;
  });
}