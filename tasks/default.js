import { watch } from 'gulp'

import build from './build'

const config = {
	sourceFiles: ['src/**/*.js', 'templates/**/*.yaml'],
}

export default function () {
	return watch(config.sourceFiles, build)
}
