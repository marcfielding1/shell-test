
module.exports = (serverless) => {
	serverless.cli.consoleLog('Generating SNS CF Mappings')

	let snsObject = {}

	snsObject[`downloadCompleteSNS${process.env.NODE_ENV}`] = {
		Type: 'AWS::SNS::Topic',
		Properties: {
			DisplayName: 'Completed download SNS topic',
			TopicName: `downloadCompleteSNS-${process.env.NODE_ENV}`,
		},
	}

	return snsObject

}
