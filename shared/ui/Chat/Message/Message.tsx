import { MessageContent, MessageRow, MessageText, MessageTime } from './styles';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { Avatar, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';

export type MessageProps = {
  isMyMessage: boolean;
  message: MessageDto;
};

export function Message({ isMyMessage, message }: MessageProps) {
  let imageThumbnail = null;
  if (!isMyMessage) {
    switch (message.user.role) {
      case UserRole.CLIENT:
        imageThumbnail = (
          <Typography variant="subtitle2">
            <PersonOutlineOutlinedIcon fontSize="inherit" sx={{ fontSize: '48px' }} />
          </Typography>
        );
        break;
      case UserRole.AGENT:
        imageThumbnail = (
          <Typography variant="subtitle2">
            <Avatar src="/icons/icon_tiretoad.png" style={{ width: '3.5rem', height: '3.5rem' }}></Avatar>
          </Typography>
        );
        break;
      case UserRole.VENDOR:
        imageThumbnail = (
          <Typography variant="subtitle2">
            <Avatar>
              <EmojiTransportationOutlinedIcon />
            </Avatar>
          </Typography>
        );
    }
  }

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
