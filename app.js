require('dotenv').config();
const express = require('express');
const app = express();

// Set the app name in a variable
app.locals.appName = process.env.APPLICATION_NAME || 'Express Template App';

const port = process.env.APPLICATION_PORT || 3000;

const db = require('./db/db');

// Setup ejs
app.set('view engine', 'ejs');

// Setup static folder
app.use(express.static('public'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable powered by header
app.disable('x-powered-by');

// Listen
app.listen(port, async () => {
	// Log the environment
	console.log('Environment:', process.env.NODE_ENV);
	// Log the port if in development mode
	if (process.env.NODE_ENV === 'Development')
		console.log(`App listening at http://localhost:${port}`);
});

// Routes
app.use('/', require('./routes/root'));
