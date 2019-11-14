
export default (event, context, callback, utils) => {

	const mocks = {
		ADD_VOYAGE_SUCCESS: () => {
			callback(null, utils.responder.success())
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

	console.log('TCL: requestedMock', requestedMock)

	try {
		mocks[requestedMock]()
	} catch (e) {
		return callback(null, utils.responder.internalServerError(`Error creating mock. Error: ${e}`))
	}
}

