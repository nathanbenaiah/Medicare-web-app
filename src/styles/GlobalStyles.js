import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.gray[800]};
    background-color: ${({ theme }) => theme.colors.gray[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
    
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSizes['5xl']};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSizes['4xl']};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.fontSizes['3xl']};
    }
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.colors};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }

  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: none;
    background: none;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.all};
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    transition: ${({ theme }) => theme.transitions.colors};
  }

  input:focus, textarea:focus, select:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Lists */
  ul, ol {
    list-style: none;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }

  /* Animation Utilities */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }
    50% {
      box-shadow: ${({ theme }) => theme.shadows.glow};
    }
  }

  /* Utility Classes */
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .glow {
    animation: glow 2s ease-in-out infinite;
  }

  /* Loading States */
  .loading {
    position: relative;
    pointer-events: none;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid transparent;
    border-top: 2px solid ${({ theme }) => theme.colors.primary[500]};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive Utilities */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Print Styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyles; 