import { styled } from '@mui/material/styles';
import { AppBar, Box } from '@mui/material';

export const StyledAppBar = styled(AppBar)(() => ({ position: 'relative', padding: 10, boxShadow: '0px 4px 34px rgba(0, 0, 0, 0.08)' }));
export const ChatMessageList = styled(Box)(() => ({
  gridArea: 'chat-message-list',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 20px',
  overflowY: 'scroll',
}));
