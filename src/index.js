import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './configs/theme'
import ThemeFetcher from './configs/ThemeFetcher';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider> */}
     <ThemeFetcher>
      {theme => (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      )}
    </ThemeFetcher>
  </React.StrictMode>
);
reportWebVitals();
