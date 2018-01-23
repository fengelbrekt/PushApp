const promise = require('bluebird');

const options = {
	promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connection = {
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'postgres'
}
const db = pgp(connection);

const getAll(req, res, next) => {
	db.any('SELECT * FROM todo')
		.then(function(data) {
			res.status(200)
			.json(data)
		})
		.catch(function(err) {
			return next(err);
		});
}

const registerUser(req, res, next) => {
	db.any('INSERT INTO users VALUES($1, $2)', [req.body.email, req.body.password])
		.then(function(data) {
			res.status(200)
			.json(data)
		})
		.catch(function(err) {
			return next(err);
		});
}

module.exports = { getAll };
