import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from 'reactflow';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ReactFlowProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactFlowProvider>
);
