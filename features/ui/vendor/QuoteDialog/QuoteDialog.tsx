import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormEvent } from 'react';
import { Stack } from '@mui/material';

export default function QuoteDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          console.log(formJson);
          handleClose();
        },
      }}
    >
      <DialogContent>
        <TextField margin="normal" id="time" name="time" label="Time" type="text" fullWidth variant="outlined" />
        <TextField margin="normal" id="quote" name="quote" label="Quote" type="text" fullWidth variant="outlined" />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" width={1} marginX={2} marginTop={-1} marginBottom={2}>
          <Button onClick={handleClose} variant="outlined" size="large">
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large">
            Send Quote
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
