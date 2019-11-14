const AWS = require('../src/libs/SDKWrapper')
const to = require('../src/libs/awaitToObjects')

const cloudWatch = new AWS.CloudWatchLogs({ region: 'eu-west-2' })

module.exports = async (serverless) => {


	let filterErr
	let	filters

	let [err, logs] = await to(cloudWatch.describeLogGroups({ logGroupNamePrefix: `/aws/lambda/pulse-API-${process.env.NODE_ENV}` }).promise())

	let arraySubscriptions = []

	for (let index = 0; index < logs.logGroups.length; index++) {
		if (logs.logGroups[index].logGroupName !== `/aws/lambda/pulse-API-${process.env.NODE_ENV}-lambdaLogger`) {

			arraySubscriptions.push({ cloudwatchLog: logs.logGroups[index].logGroupName })
		}
	}


	[err, logs] = await to(cloudWatch.describeLogGroups({ logGroupNamePrefix: `/aws/lambda/exii-pulse-api-${process.env.NODE_ENV}` }).promise())

	for (let index = 0; index < logs.logGroups.length; index++) {
		[filterErr, filters] = await to(cloudWatch.describeSubscriptionFilters({ logGroupName: logs.logGroups[index].logGroupName }).promise())


		arraySubscriptions.push({ cloudwatchLog: logs.logGroups[index].logGroupName })
	}

	if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'prod') {
		arraySubscriptions.push({ cloudwatchLog: '/ecs/pulse-processing' })
	}

	return arraySubscriptions
}
