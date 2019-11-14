const config = require('config')
const to = require('./awaitToObjects')

const mysql = require('promise-mysql')

class MySQL {

	constructor() {

		this.connection = null
	}

	async getConnection() {

		if (this.connection === null || this.connection.state === 'disconnected') {

			return this.createConnection()
		}

		return this.connection


	}

	async createConnection() {

		this.connection = await mysql.createConnection({
			host: 'tths.ctx0djyjjako.eu-west-2.rds.amazonaws.com', // TODO: Push out to config.
			user: process.env.dbUser,
			password: process.env.dbPassword,
			database: process.env.db,
		})


		return this.connection
	}

	async query(sql, params) {

		await this.getConnection()

		let err
		let rows
		[err, rows] = await to(this.connection.query(sql, params))

		if (err) {
			throw new Error(err)
		}

		return rows
	}

	async close() {
		await this.connection.end()
	}

}

module.exports = MySQL
