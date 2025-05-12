import { createTheme } from '@mui/material/styles';
import { typography } from './typography';
import { components } from './components';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C02535',
    },
    secondary: {
      main: '#F1EAEA',
    },
    background: { default: '#FAFAFA' },
  },
  shape: { borderRadius: 8 },
  typography,
  components,
});

export default theme;
