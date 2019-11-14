const bunyan = require('bunyan')
const R = require('ramda')

const log = bunyan.createLogger({
	name: 'the_log',
	serializers: {
		err: bunyan.stdSerializers.err,
		req: (event) => {
			const userId = R.path(['requestContext', 'authorizer', 'principalId'], event)
			return {
				traceId: userId,
				path: event.path,
				httpMethod: event.httpMethod,
				queryString: event.queryStringParameters,
				stage: event.stage,
				sourceIp: (event.requestContext) ? event.requestContext.identity.sourceIp : null, // this may be a GDPR issue I need to check.
				body: event.body,
			}
		},
		userTrace: (user) => {
			return {
				...user
			}
		},
		context: (context) => {

			return {
				requestId: context.awsRequestId,
			}
		},
		metrics: (metric) => {
			const [[key, value]] = Object.entries(metric)
			return {
				metricGroup: key,
				metricValue: value,
				userId: metric.userId,
			}
		},
	},
})

const logLevel = process.env.LOG_LEVEL || 'info'
log.level(logLevel)

module.exports = log

