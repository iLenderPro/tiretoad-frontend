import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputAdornment, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSubmitQuoteMutation } from '@/entities/vendorResponse/api/vendorResponseApi';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export interface QuoteDialogProps {
  vendorResponse: VendorResponseDto;
  open: boolean;
  handleClose: () => void;
}

export default function QuoteDialog({ vendorResponse, open, handleClose }: QuoteDialogProps) {
  const { register, handleSubmit } = useForm<{ eta: string; quote: number }>({
    values: { eta: vendorResponse.eta?.slice(0, 5), quote: vendorResponse?.quote },
  });
  const [submitQuote] = useSubmitQuoteMutation();

  const onSubmit = (data: { eta: string; quote: number }) => {
    const result = submitQuote({ id: vendorResponse.id, ...data }).unwrap();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogContent>
        <TextField
          {...register('eta', { required: true, setValueAs: (value) => value.slice(0, 5) })}
          fullWidth
          variant="outlined"
          margin="normal"
          type="time"
          label="Time"
          inputProps={{
            step: 300,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          {...register('quote', { required: true, valueAsNumber: true })}
          fullWidth
          variant="outlined"
          margin="normal"
          label="Quote"
          type="number"
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
