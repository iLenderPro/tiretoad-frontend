import { MessageContent, MessageRow, MessageText, MessageTime } from './styles';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { Typography } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import Box from '@mui/material/Box';

export type MessageProps = {
  isMyMessage: boolean;
  message: MessageDto;
};

export function Message({ isMyMessage, message }: MessageProps) {
  const imageThumbnail = !isMyMessage ? (
    message.user.role === UserRole.VENDOR ? (
      <Typography variant="subtitle2">
        <Box component="img" src="/icons/icon_tiretoad.png" alt="tiretoad" width={48} height={48} />
      </Typography>
    ) : (
      <Typography variant="subtitle2">
        <FaceIcon fontSize="inherit" sx={{ fontSize: '48px' }} />
      </Typography>
    )
  ) : null;

  return (
    <MessageRow $isMyMessage={isMyMessage}>
      <MessageContent $isMyMessage={isMyMessage}>
        {imageThumbnail}
        <MessageText id={message.id} $isMyMessage={isMyMessage}>
          {message.content}
        </MessageText>
        <MessageTime>{new Date(message.createdAt).toLocaleTimeString()}</MessageTime>
      </MessageContent>
    </MessageRow>
  );
}
