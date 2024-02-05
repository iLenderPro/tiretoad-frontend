import { styled } from '@mui/material/styles';
import { AppBar, Box } from '@mui/material';

export const StyledAppBar = styled(AppBar)(() => ({ position: 'relative' }));
export const ChatMessageList = styled(Box)(() => ({
  gridArea: 'chat-message-list',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 20px',
  overflowY: 'scroll',
}));
