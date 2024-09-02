const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/book');
const logger = require('./utils/logger');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});

require('dotenv').config();

const app = express();

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Something failed.');
});

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

connectDB();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api', limiter, bookRoutes);
console.log('Hey')
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
