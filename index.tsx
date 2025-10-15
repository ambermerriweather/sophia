import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import ApiKeyChecker from './components/ApiKeyChecker.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApiKeyChecker>
        <App />
      </ApiKeyChecker>
    </ErrorBoundary>
  </React.StrictMode>
);