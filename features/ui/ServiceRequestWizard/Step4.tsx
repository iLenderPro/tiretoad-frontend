import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';

export function Step4() {
  return (
    <Stack alignItems="center" gap={5}>
      <Typography variant="h4">We have 17 tire repair shops near you</Typography>
      <Stack direction="row">
        <Box flex={1}>Map</Box>
        <Box flex={1}>Form</Box>
      </Stack>
    </Stack>
  );
}
