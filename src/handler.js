/* eslint object-shorthand: 0 */
/* eslint no-shadow: 0 */
/* eslint import/prefer-default-export: 0 */
/* eslint import/first: 0 */

// Utils
const SDKWrapper = require('./libs/SDKWrapper')
const responder = require('./libs/serverless-responder')
const logger = require('./libs/logger')
const MySQL = require('./libs/MySQL')
const to = require('./libs/awaitToObjects')
const errorReporting = require('./libs/errorReporting')
const lambdaLogger = require('./libs/lambdaLogger')
const es = require('./libs/elasticsearch')

const authorizer = require('./functions/authoriser/authoriser')

// Mocks
const addVoyage = require('./mocks/addVoyage')

const mockMap = {
	addVoyage: addVoyage.default,
}

const utils = {
	AWS: SDKWrapper,
	mySQL: new MySQL(),
	logger,
	responder,
	to,
	es,
	handleGeneralError: (err, callback, utils) => {
		utils.errorReporting.RavenGeneral.captureException(err.stack, (sendErr, eventId) => {

			callback(null, responder.internalServerError())
		})
	},
	errorReporting,
}

const funcHandler = (func) => {
	return (event, context, callback) => {
		context.callbackWaitsForEmptyEventLoop = false
		utils.logger.info({ req: event, context: context }, 'Request Started')
		utils.event = event

		if (event.source === 'serverless-plugin-warmup') {
			return callback(null, utils.responder.success())
		}

		if (event.headers && event.headers['x-mock-header'] && process.env.NODE_ENV !== 'prod') {
			let arrSplit = context.functionName.split('-')
			let functionName = arrSplit[arrSplit.length - 1]

			return mockMap[functionName](event, context, callback, utils)
		}

		return utils.errorReporting.RavenGeneral.context(() => { func(event, context, callback, utils) })

	}
}

// TODO: fix gulp build so that you don't need the extra handlers.
export const lambdaLoggerHandler = funcHandler(lambdaLogger)
export { authorizer }
