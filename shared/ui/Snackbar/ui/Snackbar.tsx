'use client';
import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbar, selectSnackbarState } from '@/shared/ui/Snackbar/model/snackbarSlice';

export function Snackbar() {
  const notification = useSelector(selectSnackbarState);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <MuiSnackbar key={Math.random()} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={notification.state} onClose={handleClose} autoHideDuration={3000}>
      <Alert variant="filled" severity={notification.type}>
        {notification.content}
      </Alert>
    </MuiSnackbar>
  );
}
