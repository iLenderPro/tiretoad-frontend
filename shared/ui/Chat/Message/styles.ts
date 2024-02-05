import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isMyMessage',
})<{ $isMyMessage: boolean }>(({ $isMyMessage }) => ({
  display: 'grid',
  gridTemplateColumns: '70%',
  marginBottom: '20px',
  justifyContent: $isMyMessage ? 'end' : 'start',
  justifyItems: $isMyMessage ? 'end' : 'start',
}));
export const MessageContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isMyMessage',
})<{ $isMyMessage: boolean }>(({ $isMyMessage }) => ({
  display: 'grid',
  textAlign: $isMyMessage ? 'right' : 'left',
  ...($isMyMessage ? { justifyItems: 'end' } : { gridTemplateColumns: '48px 1fr', gridColumnGap: '15px' }),
  '> .MuiTypography-subtitle2': {
    gridRow: 'span 2',
    width: '48px',
    height: '48px',
  },
  '#thinking:after': {
    overflow: 'hidden',
    display: 'inline-block',
    verticalAlign: 'bottom',
    animation: 'ellipsis-animation steps(1,end) 2s infinite',
    content: "'\u2026'",
  },
  '@keyframes ellipsis-animation': {
    '0%': { clipPath: 'inset(0 100% 0 0)' },
    '25%': { clipPath: 'inset(0 66.6% 0 0)' },
    '50%': { clipPath: 'inset(0 33.3% 0 0)' },
    '75%': { clipPath: 'inset(0 0 0 0)' },
  },
}));

export const MessageTime = styled(Box)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.grey['700'],
}));

export const MessageText = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isMyMessage',
})<{ $isMyMessage: boolean }>(({ theme, $isMyMessage }) => ({
  ...theme.typography.body2,
  padding: '9px 14px',
  marginBottom: '5px',
  background: $isMyMessage ? theme.palette.primary.main : theme.palette.success.main,
  color: $isMyMessage ? 'white' : 'white',
  border: $isMyMessage ? '1px solid ' + theme.palette.primary.dark : '1px solid ' + theme.palette.success.dark,
  borderRadius: $isMyMessage ? '14px 14px 0 14px' : '14px 14px 14px 0',
}));
