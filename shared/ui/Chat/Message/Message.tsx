import { MessageContent, MessageRow, MessageText, MessageTime } from './styles';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { Avatar, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export type MessageProps = {
  isMyMessage: boolean;
  message: MessageDto;
};

export function Message({ isMyMessage, message }: MessageProps) {
  const imageThumbnail = !isMyMessage ? (
    message.user.role !== UserRole.CLIENT ? (
      <Typography variant="subtitle2">
        <Avatar src="/icons/icon_tiretoad.png" style={{ width: '3.5rem', height: '3.5rem' }}></Avatar>
      </Typography>
    ) : (
      <Typography variant="subtitle2">
        <PersonOutlineOutlinedIcon fontSize="inherit" sx={{ fontSize: '48px' }} />
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
