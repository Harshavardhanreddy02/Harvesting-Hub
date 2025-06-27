/**
 * Server commands and tips for development
 * This file provides helpful commands for managing the backend server
 */

export const serverCommands = {
  // Commands to start the server
  start: {
    fromRoot: "cd backend && npm start",
    fromBackend: "npm start"
  },
  
  // Commands to check server status
  check: {
    processRunning: "ps aux | grep node",
    portInUse: "lsof -i :3000",
    mongoStatus: "systemctl status mongodb" // Or "brew services list" on Mac
  },
  
  // How to read server logs
  logs: {
    viewBackendLogs: "cd backend && cat logs/app.log",
    tailBackendLogs: "cd backend && tail -f logs/app.log"
  },
  
  // Common solutions to server issues
  troubleshooting: [
    "Make sure MongoDB is running",
    "Check if the port 3000 is already in use by another application",
    "Ensure all backend dependencies are installed (npm install)",
    "Check the backend .env file for correct configuration",
    "Look at the backend logs for specific error messages",
    "Try restarting the backend server"
  ]
};

// Simple display function to help in console
export const showServerHelp = () => {
  console.group("🛠️ Server Management Help");
  console.log("If you're seeing API connection issues, try these commands:");
  
  console.group("Start Server");
  console.log(`From project root: ${serverCommands.start.fromRoot}`);
  console.log(`From backend directory: ${serverCommands.start.fromBackend}`);
  console.groupEnd();
  
  console.group("Check Server Status");
  console.log(`Check if Node is running: ${serverCommands.check.processRunning}`);
  console.log(`Check if port 3000 is in use: ${serverCommands.check.portInUse}`);
  console.log(`Check MongoDB status: ${serverCommands.check.mongoStatus}`);
  console.groupEnd();
  
  console.group("Troubleshooting Tips");
  serverCommands.troubleshooting.forEach((tip, i) => {
    console.log(`${i+1}. ${tip}`);
  });
  console.groupEnd();
  
  console.groupEnd();
  
  return "Server help displayed. Check the console for commands.";
};

// Export a function that can be called from the browser console
if (typeof window !== 'undefined') {
  window.serverHelp = showServerHelp;
}
