const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config()

// Set up the express app
const app = express();






//#region App settings
// Log requests to the console.
app.use(logger('dev'));

// setting the cross origin request settings
app.use(cors({    
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        exposedHeaders: ['x-auth-token']
    
}));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//#endregion


//#region Routing
require('./server/config/routes.js')(app, passport);
//#endregion

require('./server/config/passport')(app, passport); // pass passport for configuration

// This will be our application entry. We'll setup our server here.
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

module.exports = app;


