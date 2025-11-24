// Keep backend server alive by pinging it periodically
const BACKEND_URL = "https://edunutshell-lms.onrender.com/api";
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes

let pingInterval: NodeJS.Timeout | null = null;

export const startKeepAlive = () => {
  if (pingInterval) return; // Already running

  const ping = async () => {
    try {
      // Simple HEAD request to keep server awake
      await fetch(BACKEND_URL, { method: 'HEAD' });
      console.log('Keep-alive ping sent');
    } catch (error) {
      // Silently fail - not critical
      console.log('Keep-alive ping failed (expected if offline)');
    }
  };

  // Initial ping
  ping();

  // Set up interval
  pingInterval = setInterval(ping, PING_INTERVAL);
};

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
};
