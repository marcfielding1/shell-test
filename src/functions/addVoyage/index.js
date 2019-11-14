// TODO: We should really not import joi in every handler, probably these validations should move up a level and
// be more self contained
const Joi = require('joi')

const joiSchema = Joi.object().keys({
	vessel: Joi.string().required(),
	datetime: Joi.string().required(),
	port: Joi.string().required(),
	captain: Joi.string().required(),
})

export default async (event, context, callback, utils) => {

	const { vessel, datetime, port, captain } = JSON.parse(event.body)

	const validation = Joi.validate({ vessel, datetime, port, captain }, joiSchema)

	if (validation.error) {
		return callback(null, utils.responder.validationError(validation.error))
	}

	const date = utils.convertFunkyDate(datetime)

	if (date === false) {
		return callback(null, utils.responder.badRequest('Unexpected date format'))
	}

	// need to check the latest arrival is not before the last arrival.

	const data = {
		datetime: date,
		vessel,
		port,
		captain,
	}

	let [err, rows] = await utils.to(utils.mySQL.query('INSERT INTO voyages SET ?', data))

	if (err) {

		utils.logger.error({ req: event }, `Error inserting voyage: ${err}`)
		return callback(null, utils.responder.internal())
	}
	return callback(null, utils.responder.success())
}
