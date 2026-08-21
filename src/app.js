const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const requestContext = require('./middleware/requestContext.middleware');
const notFound = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors()); // open for now - lock down `origin` once a frontend is wired
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(requestContext);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorMiddleware); // must be last

module.exports = app;
