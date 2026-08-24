const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/env');
const logger = require('./src/utils/logger');

async function start() {
  await connectDB();

  app.listen(port, () => {
    logger.info(`NetworkUp backend listening on port ${port}`);
  });
}

start();
