/**
 *
 * In order for Lambda's to work with APIG they need to return a proper HTTP response, first stab at getting it to work.
 */

const headers = {
	'Access-Control-Allow-Origin': '*', // Required for CORS support to work
	'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
}

module.exports = {
	success: (result) => {
		return {
			statusCode: 200,
			headers,
			body: JSON.stringify(result),
		}
	},
	created: (result) => {
		return {
			statusCode: 201,
			headers,
			body: JSON.stringify(result),
		}
	},
	successWithoutJSON: (result) => {
		return {
			statusCode: 200,
			headers,
			body: result,
		}
	},
	internalServerError: (msg) => {

		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				status: 500,
				error: 'Internal Server Error',
				internalError: msg,
			}),
		}
	},
	wrap: (error, statusCode, message) => {
		return {
			statusCode,
			headers,
			body: JSON.stringify({
				error,
				message,
			}),
		}
	},
	custom: ({ payload, httpCode }) => {
		return {
			statusCode: httpCode,
			headers,
			body: JSON.stringify(payload),
		}
	},
	badRequestError: (message) => {
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify(
				message,
			),
		}
	},
	validationError: (joiErrorObject) => {
		const errors = joiErrorObject
		let messages = []

		joiErrorObject.details.forEach((error) => {
			messages.push(error.message)
		})

		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({
				error: 'Bad Request Error',
				badRequest: messages,
			}),
		}

	},
	unAuthorised: (message) => {
		return {
			statusCode: 401,
			headers,
			body: JSON.stringify({
				status: 401,
				error: 'unAuthorised',
				unauth: message,
			}),
		}
	},
	methodNotAllowed: (message) => {
		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({
				error: 'Method not allowed',
				message,
			}),
		}
	},
	notFound: () => {
		return {
			statusCode: 404,
			headers,
			body: JSON.stringify({
				error: 'Not Found',
			}),
		}
	},
	html: function html(_html) {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*', // Required for CORS support to work
				'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
				'Content-type': 'text/html',
			},
			body: _html,
		}
	},
	redirect: function redirect(location) {
		return {
			statusCode: 302,
			headers: {
				'Access-Control-Allow-Origin': '*', // Required for CORS support to work
				'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
				Location: location,
			},

		}
	},
}
