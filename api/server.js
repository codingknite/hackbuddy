const { createServer } = require('http');

const app = require('./app');
const config = require('./config/index');

const { devConfig } = config;
const server = createServer(app);

server.listen(devConfig.PORT);
