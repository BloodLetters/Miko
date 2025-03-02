import React from 'react';
import { ThemeProvider } from './utils/Theme';
import Layout from './components/Layout'; 

function App() {
  return (
    <div className="app">
       <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </div>
  );
}

export default App;