
export default (event, context, callback, utils) => {

	const mocks = {
		GET_VOYAGES_SUCCESS: () => {
			callback(null, utils.responder.success({
				captainName: 'Marc Fielding',
				trips: [
					{
						vessel: 'The Black Pearl',
						captain: 'Jack Sparrow',
						fromDate: '2717625600',
						toDate: '2717712000',
						from: 'Singapore',
						to: 'New York',
					},
				],
			}))
		},
		BAD_REQUEST: () => {
			callback(null, utils.responder.badRequest())
		},
		INTERNAL_SERVER_ERROR: () => {
			callback(null, utils.responder.internalServerError())
		},
	}

	const requestedMock = event.headers['x-mock-header']

	if (!requestedMock) {
		return callback(null, utils.responder.internalServerError('No mock value found in x-mock-header'))
	}

	try {
		mocks[requestedMock]()
	} catch (e) {
		return callback(null, utils.responder.internalServerError(`Error creating mock. Error: ${e}`))
	}
}

