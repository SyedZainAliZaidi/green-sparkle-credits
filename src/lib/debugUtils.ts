// Debug utilities for development mode only

export const debugLog = (category: string, message: string, data?: any) => {
  if (!import.meta.env.DEV) return;
  
  const timestamp = new Date().toISOString();
  const style = 'color: #10b981; font-weight: bold';
  
  console.group(`%c[${category}] ${timestamp}`, style);
  console.log(message);
  if (data) {
    console.log('Data:', data);
  }
  console.groupEnd();
};

export const debugApiCall = (endpoint: string, method: string, data?: any, response?: any) => {
  if (!import.meta.env.DEV) return;
  
  console.group(`%c[API] ${method} ${endpoint}`, 'color: #3b82f6; font-weight: bold');
  if (data) console.log('Request:', data);
  if (response) console.log('Response:', response);
  console.groupEnd();
};

export const debugError = (context: string, error: any) => {
  if (!import.meta.env.DEV) return;
  
  console.group(`%c[ERROR] ${context}`, 'color: #ef4444; font-weight: bold');
  console.error(error);
  console.trace();
  console.groupEnd();
};

export const debugPerformance = (label: string, callback: () => void) => {
  if (!import.meta.env.DEV) {
    callback();
    return;
  }
  
  const start = performance.now();
  callback();
  const end = performance.now();
  
  console.log(`%c[PERFORMANCE] ${label}: ${(end - start).toFixed(2)}ms`, 'color: #f59e0b; font-weight: bold');
};

export const showDebugToast = (message: string, data?: any) => {
  if (!import.meta.env.DEV) return;
  
  // Create a debug toast element
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-20 right-4 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 text-yellow-900 dark:text-yellow-100 px-4 py-2 rounded-lg shadow-lg z-50 max-w-md text-sm';
  toast.innerHTML = `
    <div class="font-semibold mb-1">🐛 Debug</div>
    <div>${message}</div>
    ${data ? `<pre class="mt-2 text-xs overflow-auto max-h-32">${JSON.stringify(data, null, 2)}</pre>` : ''}
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 5000);
};
