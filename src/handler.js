/* eslint object-shorthand: 0 */
/* eslint no-shadow: 0 */
/* eslint import/prefer-default-export: 0 */
/* eslint import/first: 0 */

import SDKWrapper from './libs/SDKWrapper'
import responder from './libs/serverless-responder'
import logger from './libs/logger'
import MySQL from './libs/MySQL'
import to from './libs/awaitToObjects'
import errorReporting from './libs/errorReporting'
import lambdaLogger from './libs/lambdaLogger'
import es from './libs/elasticsearch'


import authorizer from './functions/authoriser/authoriser'

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
