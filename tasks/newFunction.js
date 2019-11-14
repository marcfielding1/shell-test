import { argv } from 'yargs'

import createFunction from './createFunction'

export default function newFunction(done) {
	if (!argv.n) {
		process.stdout.write('ERROR: \n\n')
		process.stdout.write('Usage: gulp newFunction -n functionName\n\n')
		return
	}
	createFunction(argv.n, done)
}
