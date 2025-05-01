import { Components } from '@mui/material/styles/components';
import { Theme } from '@mui/material/styles/createTheme';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiToggleButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
  },
};
