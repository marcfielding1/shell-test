/* eslint-disable */
// Eslint disabled as this is adapted AWS code.

const logger = require('./logger')

const zlib = require('zlib')
const elasticsearch = require('@elastic/elasticsearch')

/**
 * This is an example function to stream CloudWatch logs to ElasticSearch.
 * @param event
 * @param context
 * @param callback
 * @param utils
 */
function lambdaLogger(event, context, callback, utils){
	try {
		context.callbackWaitsForEmptyEventLoop = true

		const payload = new Buffer(event.awslogs.data, 'base64')

		const esClient = new elasticsearch.Client({
			node: 'https://TTHS:ZXUtd2VzdC0xLmF3cy5mb3VuZC5pbyRlNDQ3MGE2OTFkODk0NmU2YjI2NzhkN2I4YjBlZDA4MSQ1MjRhNjVjYWU1NTA0MmExOGEzOGU3YmFmYTA2MTI5Yg==@f77c113e15804768add61732ac70d76d.eu-west-1.aws.found.io:9243',
		})

		zlib.gunzip(payload, (err, result) => {

			if (err) {
				return callback(null, err)
			}

			const logObject = JSON.parse(result.toString('utf8'))

			const elasticsearchBulkData = transform(logObject)

			const params = { body: [] }
			params.body.push(elasticsearchBulkData)

			esClient.bulk(params, (err, resp) => {

				if (err) {
					logger.error(err)
			callback(null, 'success')
			return
		}

				logger.info({ response: resp }, 'RESPONSE')
			})

			callback(null, 'success')
		})
	} catch (e) {
		logger.error('LOGGER ERROR', e)
	}
}

function transform(payload) {
	if (payload.messageType === 'CONTROL_MESSAGE') {
		return null
	}

	let bulkRequestBody = ''

	payload.logEvents.forEach((logEvent) => {
		const timestamp = new Date(1 * logEvent.timestamp)

        // index name format: cwl-YYYY.MM.DD
		const indexName = [
			`pulse-api-${process.env.NODE_ENV}-${timestamp.getUTCFullYear()}`,              // year
			(`0${timestamp.getUTCMonth() + 1}`).slice(-2),  // month
			(`0${timestamp.getUTCDate()}`).slice(-2),          // day
		].join('.')

		const source = buildSource(logEvent.message, logEvent.extractedFields)
		source['@id'] = logEvent.id
		source['@timestamp'] = new Date(1 * logEvent.timestamp).toISOString()
		source['@message'] = logEvent.message
		source['@owner'] = payload.owner
		source['@log_group'] = payload.logGroup
		source['@log_stream'] = payload.logStream

		const action = { index: {} }
		action.index._index = indexName
		action.index._type = 'lambdaLogs'
		action.index._id = logEvent.id

		bulkRequestBody += `${[
			JSON.stringify(action),
			JSON.stringify(source),
		].join('\n')}\n`
	})
	return bulkRequestBody
}

function buildSource(message, extractedFields) {
	if (extractedFields) {
		const source = {}

		for (const key in extractedFields) {
			if (extractedFields.hasOwnProperty(key) && extractedFields[key]) {
				const value = extractedFields[key]

				if (isNumeric(value)) {
					source[key] = 1 * value
					continue
				}

				const jsonSubString = extractJson(value)
				if (jsonSubString !== null) {
					source[`$${key}`] = JSON.parse(jsonSubString)
				}

				source[key] = value
			}
		}
		return source
	}

	const jsonSubString = extractJson(message)
	if (jsonSubString !== null) {
		return JSON.parse(jsonSubString)
	}

	return {}
}

function extractJson(message) {
	const jsonStart = message.indexOf('{')
	if (jsonStart < 0) return null
	const jsonSubString = message.substring(jsonStart)
	return isValidJson(jsonSubString) ? jsonSubString : null
}

function isValidJson(message) {
	try {
		JSON.parse(message)
	} catch (e) { return false }
	return true
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n)
}

module.exports = lambdaLogger