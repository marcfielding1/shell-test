export default async (event, context, callback, utils) => {
	const { captain } = event.pathParameters

    // TODO: watch out for multiple path params
	const decodedCaptain = decodeURIComponent(captain.replace('%2B', '%20'))

	let [err, rows] = await utils.to(utils.mySQL.query('SELECT * FROM voyages WHERE captain = ? ORDER BY datetime DESC', [decodedCaptain]))

	if (err) {
		utils.logger.error({ req: event }, `Error getting voyages: ${err}`)
		return callback(null, utils.responder.internalServerError())
	}


	const response = {
		captainName: decodedCaptain,
		trips: JSON.parse(JSON.stringify(rows)),
	}

	console.log(response)
	return callback(null, utils.responder.success(response))

}
