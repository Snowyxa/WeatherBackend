const packageJson = require('../../package.json');

// Ping the server to check if it is alive
const ping = () => ({ pong: true });

// Get the version of the server and the environment
const getVersion = () => ({
  env: process.env.NODE_ENV,
  version: packageJson.version,
  name: packageJson.name,
});

module.exports = {
  ping,
  getVersion,
};

