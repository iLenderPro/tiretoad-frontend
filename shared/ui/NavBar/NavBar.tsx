'use client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MailIcon from '@mui/icons-material/Mail';
import OutboxOutlinedIcon from '@mui/icons-material/OutboxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Avatar, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserSession, setUserSession } from '@/entities/account/authSlice';
import { useLogoutMutation } from '@/entities/account/api/accountApi';
import { useParams, useRouter } from 'next/navigation';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';
import { useGetUnreadMessagesQuery } from '@/entities/chat/api/chatApi';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export default function NavBar() {
  const session = useSelector(selectUserSession);
  const [logout] = useLogoutMutation();
  const { data: unreadMessages } = useGetUnreadMessagesQuery(undefined, {
    skip: !session?.user,
    pollingInterval: 1000,
  });
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const unreadMessagesIsOpen = Boolean(anchorEl);

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const toggleLeftDrawer = (newOpen: boolean) => () => {
    setLeftDrawerOpen(newOpen);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    const result = await logout(undefined).unwrap();
    dispatch(setUserSession({ authToken: undefined, user: undefined }));
    router.refresh();
  };

  const handleUnreadMessagesClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMessageClick = (event: MouseEvent<HTMLLIElement>) => {
    router.push(`/responses/${event.currentTarget.id}/chat`);
    setAnchorEl(null);
  };

  const handleUnreadMessagesClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar variant="outlined" elevation={0} position="sticky" color="default">
        <Toolbar>
          <Box flex={1 / 3}>
            {params.slug && (
              <IconButton size="large" color="inherit" aria-label="open drawer" onClick={() => router.back()}>
                <ArrowBackOutlinedIcon />
              </IconButton>
            )}
          </Box>
          <Box display="flex" flex={1} sx={{ flexGrow: 1 }} alignItems="center" justifyContent="center" gap={1}>
            <Image src="/icons/icon_tiretoad.png" alt="TireToad" width="26" height="26" />
            <Typography variant="h2">TireToad</Typography>
          </Box>
          <Box flex={1 / 3} textAlign="right">
            <IconButton size="large" color="inherit" aria-label="open drawer" onClick={toggleLeftDrawer(true)}>
              <MenuIcon />
            </IconButton>
            {false && (
              <Stack direction="row" justifyContent="flex-end">
                {/*<IconButton size="large" aria-label="show 17 new notifications" color="inherit">*/}
                {/*  <Badge badgeContent={17} color="error">*/}
                {/*    <NotificationsIcon />*/}
                {/*  </Badge>*/}
                {/*</IconButton>*/}
                <IconButton disabled={!unreadMessages?.length} size="large" aria-label={`show ${unreadMessages} new messages`} color="inherit" onClick={handleUnreadMessagesClick}>
                  <Badge badgeContent={unreadMessages?.length} color="error">
                    <MailIcon color="inherit" />
                  </Badge>
                </IconButton>
                {!!unreadMessages?.length && (
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={unreadMessagesIsOpen}
                    onClose={handleUnreadMessagesClose}
                    slotProps={{ paper: { style: { maxHeight: '80vh', width: '80%', maxWidth: '400px' } } }}
                  >
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {unreadMessages?.map((message) => (
                        <MenuItem key={message.id} id={message.request?.id || message.response?.id} onClick={handleMessageClick}>
                          <ListItemAvatar>
                            <Avatar src="/icons/icon_tiretoad.png" />
                          </ListItemAvatar>
                          <ListItemText
                            primaryTypographyProps={{ display: 'block', noWrap: true }}
                            secondaryTypographyProps={{ display: 'block', noWrap: true }}
                            primary={
                              session.user?.role === UserRole.CLIENT ? `${message.user.fullName} from ${(message.user as VendorDto).businessName}` : `${message.user.fullName}`
                            }
                            secondary={message.content}
                          />
                        </MenuItem>
                      ))}
                    </List>
                  </Menu>
                )}
              </Stack>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={leftDrawerOpen} onClose={toggleLeftDrawer(false)}>
        <Box minWidth="300px" role="presentation" onClick={toggleLeftDrawer(false)}>
          {session?.user ? (
            <List>
              <ListItem key="user-info">
                <ListItemButton>
                  <ListItemIcon style={{ minWidth: 40 }}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: 'h6' }}
                    primary={session?.user.fullName}
                    secondary={session?.user.role === UserRole.VENDOR && (session?.user as VendorDto).businessName}
                  />
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" />
              {session?.user.role !== UserRole.VENDOR && (
                <ListItem key="new-request">
                  <ListItemButton onClick={() => router.push('/')}>
                    <ListItemIcon style={{ minWidth: 40 }}>
                      <AddCircleOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="New request" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem key="service-requests">
                <ListItemButton onClick={() => router.push('/requests')}>
                  <ListItemIcon style={{ minWidth: 40 }}>
                    <OutboxOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="All requests" />
                </ListItemButton>
              </ListItem>
              <ListItem key="account">
                <ListItemButton onClick={() => router.push('/account')}>
                  <ListItemIcon style={{ minWidth: 40 }}>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="My profile" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem key="login" disablePadding>
                <ListItemButton onClick={handleLogin}>
                  <ListItemIcon style={{ minWidth: 40 }}>
                    <LoginOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
          {session?.user && (
            <>
              <Divider variant="middle" />
              <List>
                <ListItem key="logout">
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon style={{ minWidth: 40 }}>
                      <LogoutOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
