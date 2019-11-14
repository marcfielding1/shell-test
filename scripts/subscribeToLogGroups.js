const AWS = require('../src/libs/SDKWrapper')
const to = require('../src/libs/awaitToObjects')

const cloudWatch = new AWS.CloudWatchLogs({ region: 'eu-west-2' })

module.exports = async (serverless) => {


	let filterErr
	let	filters

	let [err, logs] = await to(cloudWatch.describeLogGroups({ logGroupNamePrefix: `/aws/lambda/shell-test-${process.env.NODE_ENV}` }).promise())

	let arraySubscriptions = []

	for (let index = 0; index < logs.logGroups.length; index++) {
		if (logs.logGroups[index].logGroupName !== `/aws/lambda/shell-test-${process.env.NODE_ENV}-lambdaLogger`) {

			arraySubscriptions.push({ cloudwatchLog: logs.logGroups[index].logGroupName })
		}
	}

	return arraySubscriptions
}
