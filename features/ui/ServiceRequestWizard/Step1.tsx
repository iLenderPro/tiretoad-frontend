import Typography from '@mui/material/Typography';
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import Image from 'next/image';

export function Step1() {
  return (
    <Stack alignItems="center" gap={5}>
      <Typography variant="h4">What repair do you need?</Typography>
      <RadioGroup row name="tire-damage">
        <Stack alignItems="center">
          <Image src="/images/flat-tire.png" width={100} height={100} alt="Flat tire repair" />
          <FormControlLabel value="FLAT" control={<Radio />} label="My Tire is Flat" />
        </Stack>
      </RadioGroup>
      <Typography variant="h4">Which tire is it?</Typography>
      <RadioGroup row name="tire-side">
        <Stack alignItems="center">
          <Image src="/images/wheel-front-left.png" width={100} height={100} alt="Driver Side Front Tire" />
          <FormControlLabel value="LF" control={<Radio />} label="Driver Side Front (LF)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-rear-left.png" width={100} height={100} alt="Driver Side Rear Tire" />
          <FormControlLabel value="LR" control={<Radio />} label="Driver Side Rear (LR)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-front-right.png" width={100} height={100} alt="Passenger Side Front Tire" />
          <FormControlLabel value="RF" control={<Radio />} label="Passenger Side Front (RF)" />
        </Stack>
        <Stack alignItems="center">
          <Image src="/images/wheel-rear-right.png" width={100} height={100} alt="Passenger Side Rear Tire" />
          <FormControlLabel value="RR" control={<Radio />} label="Passenger Side Rear (RR)" />
        </Stack>
      </RadioGroup>
    </Stack>
  );
}
