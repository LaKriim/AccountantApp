// src/theme/index.js
import { createTheme } from '@mui/material/styles';

// Define your base theme
const baseTheme = {
  typography: {
    fontFamily: 'IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif',
    // Define custom typography options
    display2xl: {
      fontSize: '72px',
      lineHeight: '84px',
      letterSpacing: '-0.02em',
    },
    displayXl: {
      fontSize: '60px',
      lineHeight: '72px',
      letterSpacing: '-0.02em',
    },
    // Add more typography styles as needed...
  },
  palette: {
    primary: {
      main: '#504f4e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#504f4e',
    },
    // Define your custom colors here...
    finroy: {
      blue: {
        500: '#1115CF',
        main: '#1115CF',
        light: '#A7A4FF',
        dark: '#080E8C',
        contrastText: '#E8E8E3',
      },
      // Add more colors like green, black, etc.
    },
    // Add other color schemes...
  },
  shape: {
    borderRadius: 5,
  },
  // Customize other MUI components here...
};

const theme = createTheme(baseTheme);

export default theme;
