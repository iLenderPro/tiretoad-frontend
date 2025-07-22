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

export const timeOptions = [
  {
    value: 15,
    label: '15 min',
  },
  {
    value: 30,
    label: '30 min',
  },
  {
    value: 45,
    label: '45 min',
  },
  {
    value: 60,
    label: '1 hour',
  },
  {
    value: 75,
    label: '1 hour 15 min',
  },
  {
    value: 90,
    label: '1 hour 30 min',
  },
  {
    value: 105,
    label: '1 hour 45 min',
  },
  {
    value: 120,
    label: '2 hours',
  },
  {
    value: 135,
    label: '2 hours 15 min',
  },
  {
    value: 150,
    label: '2 hours 30 min',
  },
];

export default function QuoteDialog({ vendorResponse, open, handleClose }: QuoteDialogProps) {
  const { register, handleSubmit } = useForm<{ eta: number; quote: number }>({
    values: { eta: vendorResponse.eta, quote: vendorResponse?.quote },
  });
  const [submitQuote] = useSubmitQuoteMutation();

  const onSubmit = (data: { eta: number; quote: number }) => {
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
      <DialogContent sx={{ paddingTop: (theme) => theme.spacing(4) }}>
        <TextField
          {...register('eta', { required: true })}
          select
          fullWidth
          variant="outlined"
          label="ETA"
          defaultValue=""
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
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
          inputProps={{ min: 0 }}
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
