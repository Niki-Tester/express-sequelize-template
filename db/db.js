const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT,
		logging: eval(process.env.DB_LOGGING) ? console.log : '',
	}
);

const MAX_RETRIES = process.env.DB_CONNECT_MAX_RETRIES || 5; // Maximum number of connection retries
const RETRY_DELAY = process.env.DB_CONNECT_RETRY_DELAY_MS || 5000; // Delay in milliseconds between retries

function connectWithRetry(retries = 0) {
	sequelize
		.authenticate()
		.then(() => {
			console.log('Database connection has been established successfully.');
		})
		.catch(err => {
			if (retries < MAX_RETRIES) {
				console.log(`Retrying db connection (${retries + 1}/${MAX_RETRIES})...`);
				setTimeout(() => {
					connectWithRetry(retries + 1);
				}, RETRY_DELAY);
			} else {
				console.error(
					`Maximum number of connection retries reached (${MAX_RETRIES}). Exiting...`
				);
				console.error('Unable to connect to db:', err);
				process.exit(1); // Exit the application or handle the failure gracefully
			}
		});
}

// Sync the database (create tables if they do not exist)
if (eval(process.env.DB_SYNC)) {
	sequelize
		.sync({
			force: eval(process.env.DB_FORCE_SYNC),
			alter: eval(process.env.DB_ALTER_SYNC),
		})
		.then(() => {
			console.log('Database synchronized.');
		})
		.catch(err => {
			console.error('Unable to synchronize the database:', err);
		});
}

connectWithRetry();

module.exports = sequelize;
