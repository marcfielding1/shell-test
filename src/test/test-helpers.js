import sinon from 'sinon'
import logger from 'pulse-core-libs/logger'
import responder from 'pulse-core-libs/serverless-responder'

const generateApiGatewayEvent = ({
	body,
	pathParameters = null,
	queryStringParameters = null,
	userId,
	headers = {},
} = {}) => (
	{
		headers: Object.assign({ Host: 'localhost:3000' }, headers),
		path: '/the-path',
		pathParameters,
		requestContext: {
			authorizer: { principalId: userId || 'the-user-id' },
			identity: { sourceIp: '1.2.3.4' },
		},
		resource: '/the-path',
		httpMethod: 'POST',
		queryStringParameters,
		body: (body ? JSON.stringify(body) : null),
	}
)

const generateHandlerUtils = () => ({
	errorReporting: sinon.stub(),
	AWS: sinon.stub(),
	logger: {
		info: sinon.stub(),
		error: sinon.stub(),
		debug: sinon.stub(),
	},
	responder,
	db: {
		mySQL: {
			getReadConnection: sinon.stub().resolves(true),
			getWriteConnection: sinon.stub().resolves(true),
			readQuery: sinon.stub(),
			writeQuery: sinon.stub(),
		},
	},
	handleGeneralError: (err, cb) => cb(null, responder.internalServerError()),
	handleMySQLError: sinon.stub(),
})

module.exports = {
	generateApiGatewayEvent,
	generateHandlerUtils,
}
