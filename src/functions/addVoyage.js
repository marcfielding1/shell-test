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

	return callback(null, utils.responder.success())
}
