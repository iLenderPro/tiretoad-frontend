'use client';
import { Button, Card, CardActions, CardContent, Divider, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { ChatMessageList, StyledAppBar } from './styles';
import SendIcon from '@mui/icons-material/Send';
import { useForm } from 'react-hook-form';
import { Message } from './Message/Message';
import { useGetMessageQuery, useSendMessageMutation } from '@/entities/chat/api/chatApi';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { UserDto } from '@/entities/user/api/dto/UserDto';

export type ChatProps = {
  user: UserDto;
  vendorResponse: VendorResponseDto;
};

export function Chat({ user, vendorResponse }: ChatProps) {
  const { data: messages, isLoading, refetch } = useGetMessageQuery(vendorResponse?.id || '', { pollingInterval: 3000 });
  const [sendMessage, { isLoading: isMessageSending }] = useSendMessageMutation();
  const { register, handleSubmit, reset } = useForm<{ prompt: string }>({ defaultValues: { prompt: '' } });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (data: { prompt: string }) => {
    sendMessage({ vendorResponse, user, prompt: data.prompt });
    reset({ prompt: '' });
    refetch();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
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
        <StyledAppBar elevation={2} position="fixed">
          <Toolbar>
            <Typography variant="h6">Conversation</Typography>
          </Toolbar>
        </StyledAppBar>
        <CardContent sx={{ overflow: 'scroll', height: '100%' }}>
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
    </>
  );
}
