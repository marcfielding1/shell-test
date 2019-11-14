
export default (event, context, callback, utils) => {

	const mocks = {
		ADD_VOYAGE_SUCESS: () => {
			callback(null, utils.responder.success())
		},
		BAD_REQUEST: () => {
			callback(null, utils.responder.badRequest())
		},
		INTERNAL_SERVER_ERROR: () => {
			callback(null, utils.responder.internalServerError())
		},
	}

    // TODO: dry this up in future too
	const requestedMock = event.headers['x-mock-header']

	if (!requestedMock) {
		return callback(null, utils.responder.internalServerError('No mock value found in x-mock-header'))
	}

	try {
		mocks[requestedMock]()
	} catch (e) {
		// TODO: crashes come here why?
		return callback(null, utils.responder.internalServerError(`Error creating mock. Error: ${e}`))
	}
}

