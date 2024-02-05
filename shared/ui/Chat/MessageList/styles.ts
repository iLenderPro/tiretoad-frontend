import { styled } from '@mui/material/styles';

export const MessageList = styled('div')(() => ({
  gridArea: 'chat-message-list',
  display: 'flex',
  flexDirection: 'column-reverse',
  padding: '0 20px',
  overflowY: 'scroll',
}));
