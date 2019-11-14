// TODO: We should really not import joi in every handler, probably these validations should move up a level and
// be more self contained
const Joi = require('joi')

const joiSchema = Joi.object().keys({
	captain: Joi.string().required(),
})

export default async (event, context, callback, utils) => {
	const { captain } = event.pathParameters

    // TODO: watch out for multiple path params, this isn't a good way to do this but works for our purposes.
	const decodedCaptain = decodeURIComponent(captain.replace('%2B', '%20'))

	const validation = Joi.validate({ captain }, joiSchema)

	if (validation.error) {
		return callback(null, utils.responder.validationError(validation.error))
	}

	let [err, rows] = await utils.to(utils.mySQL.query('SELECT * FROM voyages WHERE captain = ? ORDER BY datetime ASC', [decodedCaptain]))

	if (err) {
		utils.logger.error({ req: event }, `Error getting voyages: ${err}`)
		return callback(null, utils.responder.internalServerError())
	}


    // we do this to get rid of the RowDataPacket bit we get back from the MySQL driver.
	const trips = JSON.parse(JSON.stringify(rows))
	const parsedTrips = utils.calculateJourneys(trips)
	const response = {
		captainName: decodedCaptain,
		trips: parsedTrips,
	}

	console.log(response)
	return callback(null, utils.responder.success(response))

}
