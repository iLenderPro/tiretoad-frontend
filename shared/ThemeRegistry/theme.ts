import { createTheme } from '@mui/material/styles';
import { typography } from './typography';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography,
});

export default theme;
