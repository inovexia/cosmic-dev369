import { createTheme } from '@mui/material/styles'
const primaryColor = '#5A6DF9';
const theme = createTheme({
  palette: {
    app: {
      main: '#9747FF',
      dark: '#491281',
      light: '#B062FF',
      contrastText: '#ffffff'
    },
    review: {
      main: '#14C0CC',
      dark: '#14C0CC',
      light: '#14C0CC',
      contrastText: '#ffffff'
    },
    bgColor: {
      main: '#EFF0FE',
      dark: '#CAD0FF',
    },
    // primary: {
    //   main: '#d92c1c',
    //   dark: '#084FC7',
    //   light: '#0373F34D'
    // },
    primary: {
      main: primaryColor,
      dark: '#223093',
      light: '#A5B0FF'
    },
    secondary: {
      main: '#FF725E',
      dark: '#993325',
      light: '#FFD1CA',
      contrastText: '#ffffff'
    },
    success: {
      main: '#049478',
      dark: '#067c65',
      light: '#02cda5'
    },
    error: {
      main: '#AD0000'
    },
    danger: {
      main: '#AD0000'
    },
    info: {
      main: '#55DEFF',
      dark: '#57C7E4',
      light: '#55DEFF66'
    },
    warning: {
      main: '#F29913',
      dark: '#C77E2E',
      light: '#FAAF3A'
    },
    text: {
      light: '#4D6276',
      primary: '#203B54'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    button: {
      textTransform: 'capitalize',
      borderRadius: 65
    }
  },
  components: { 
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },

        '*::-webkit-scrollbar': {
          height: '5px',
          width: '5px'
        },

        '*::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1'
        },

        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgb(158, 158, 158)',
          borderRadius: '10px'
        },

        html: {
          scrollBehavior: 'smooth'
        },

        body: {
          fontFamily: 'Roboto,"sans-serif"'
        },

        '#root': {
          overflowX: 'hidden'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 65, // Update the desired border radius value
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Update the desired shadow value
        },
      },
    },
  }
})

export default theme
