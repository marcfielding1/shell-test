import aws from 'aws-sdk'
import { argv } from 'yargs'
import fs from 'fs'

const region = argv.r || 'eu-west-2'
const profile = argv.p
if (profile) {
	const credentials = new aws.SharedIniFileCredentials({ profile })
	aws.config.credentials = credentials
}
const ssm = new aws.SSM({ region })
const RERQUIRED_PARAMETERS = [
	'pulse_db_user',
	'pulse_password',
	'pulse_db'
]

const usage = `
Usage: gulp setSsmParams -s stage -r region -p profile -f sourceFile
  -s: Serverless stage. All the parameters will be suffixed with the stage
  -r: (optional) AWS region (\`eu-west-2\` by default)
  -p: (optional) AWS profile
  -f: (optional) name of the file that holds the parameters, separated by lines
  		with the format key=value (\`.env.<stage>\` by default)

`

export default function setSsmParameters(done) {
	const stage = argv.s
	if (!stage) {
		process.stdout.write('\nERROR: the Serverless stage was not specified\n')
		process.stdout.write(usage)
		return
	}
	const sourceFile = argv.f
	const parameters = getParameters({ stage, sourceFile })
	return setParameters(parameters, stage).then(() => done()).catch(done)
}

function getParameters({ stage, sourceFile = `.env.${stage}` } = {}) {
	const parameters = getParametersFromFile(sourceFile)
	return RERQUIRED_PARAMETERS.reduce((total, paramName) => {
		const paramValue = parameters[paramName]
		return paramValue ? Object.assign(total, { [paramName]: paramValue }) : total
	}, {})
}

function getParametersFromFile(sourceFile) {
	const fileContents = fs.readFileSync(sourceFile, 'utf-8')
	const delimiter = '='
	return fileContents.split('\n').reduce((total, currentLine) => {
		const [key, ...valueParts] = currentLine.split(delimiter)
		const value = valueParts.join(delimiter)
		return Object.assign({}, total, { [key]: value })
	}, {})
}

function setParameters(parameters, stage) {
	const promises = Object.entries(parameters).map(([key, value]) => {
		const namespacedKey = `${key}-${stage}`
		return setSsmParameter(namespacedKey, value)
	})
	return Promise.all(promises)
}

function setSsmParameter(key, value) {
	const params = {
		Name: key,
		Type: 'String',
		Value: value,
		Overwrite: false,
	}
	return ssm.putParameter(params).promise()
}
