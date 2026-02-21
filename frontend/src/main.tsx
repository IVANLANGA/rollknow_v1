import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('[main.tsx] Script started');

try {
  const rootElement = document.getElementById('root');
  console.log('[main.tsx] Root element:', rootElement);

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  console.log('[main.tsx] Root created, rendering App...');

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('[main.tsx] Render called');
} catch (error) {
  console.error('[main.tsx] Error during render:', error);
}
