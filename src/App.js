import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

// Components
import HealthAssistant from './components/HealthAssistant';
import AssessmentPage from './components/AssessmentPage';
import ResultsPage from './components/ResultsPage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health-assistant" element={<HealthAssistant />} />
          <Route path="/assessment/:type" element={<AssessmentPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 