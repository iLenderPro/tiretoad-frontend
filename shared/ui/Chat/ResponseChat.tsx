'use client';
import { Avatar, Button, Card, CardActions, CardContent, Divider, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { ChatMessageList, StyledAppBar } from './styles';
import SendIcon from '@mui/icons-material/Send';
import { useForm } from 'react-hook-form';
import { Message } from './Message/Message';
import { useGetResponseMessagesQuery, useMarkAsReadMutation, useSendMessageMutation } from '@/entities/chat/api/chatApi';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import Box from '@mui/material/Box';

export type ChatProps = {
  user: ClientDto;
  vendorResponse: VendorResponseDto;
};

export function ResponseChat({ user, vendorResponse }: ChatProps) {
  const { data: messages, isLoading, refetch } = useGetResponseMessagesQuery(vendorResponse?.id || '', { pollingInterval: 1000 });
  const [sendMessage, { isLoading: isMessageSending }] = useSendMessageMutation();
  const { register, handleSubmit, reset } = useForm<{ prompt: string }>({ defaultValues: { prompt: '' } });
  const [markAsRead] = useMarkAsReadMutation();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (data: { prompt: string }) => {
    reset({ prompt: '' });
    await sendMessage({ response: vendorResponse, user, content: data.prompt });
    refetch();
  };

  useEffect(() => {
    scrollToBottom();
    messages && markAsRead(vendorResponse.id);
  }, [messages]);

  return (
    <Card
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: '350px',
        minHeight: '80vh',
        maxHeight: '80vh',
      }}
    >
      <StyledAppBar elevation={0} position="fixed" color="transparent">
        <Toolbar>
          <Stack direction="row" gap={1} alignItems="center">
            <Avatar>{user.role === UserRole.VENDOR && <Box component="img" src="/icons/icon_tiretoad.png" alt="tiretoad" width={32} height={32} />}</Avatar>
            <Stack>
              <Typography variant="body1" fontWeight="700">
                {user.role === UserRole.VENDOR && 'Towing Agent'}
                {user.role === UserRole.AGENT && vendorResponse.vendor.fullName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.role === UserRole.VENDOR && vendorResponse.serviceRequest.agent.fullName}
                {user.role === UserRole.AGENT && vendorResponse.vendor.businessName}
              </Typography>
            </Stack>
          </Stack>
        </Toolbar>
      </StyledAppBar>
      <CardContent sx={{ overflow: 'scroll', height: '100%', flexGrow: 1 }}>
        <ChatMessageList>
          {messages && messages.map((message) => <Message key={message.id} isMyMessage={message.user.id === user.id} message={message} />)}
          <div ref={messagesEndRef} />
        </ChatMessageList>
      </CardContent>
      <Divider />
      <CardActions>
        <form onSubmit={handleSubmit(handleSendMessage)} style={{ width: '100%' }}>
          <Stack direction="row" width={1} gap={1}>
            <TextField {...register('prompt', { required: true, setValueAs: (v) => v.trim() })} fullWidth />
            <Button type="submit" autoFocus variant="contained" size="large" endIcon={<SendIcon />}>
              Send
            </Button>
          </Stack>
        </form>
      </CardActions>
    </Card>
  );
}
