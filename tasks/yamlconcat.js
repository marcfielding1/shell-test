import gulp from 'gulp'
import order from 'gulp-order'
import concat from 'gulp-concat'
import insert from 'gulp-insert'

import swagger from './swagger'

export default function yamlconcat() {
	return swagger()
	.then((funcs) => {
		return gulp.src('./templates/serverless/**/*.yaml')
		.pipe(order([
			'**/provider/*.yaml',
			'**/functions/header.yaml',
			'**/functions/*.yaml',
			'**/resource/header.yaml',
			'**/resource/*.yaml',
			'**/plugins/header.yaml',
			'**/plugins/*.yaml',
		]))
		.pipe(concat('serverless.yml'))
		.pipe(insert.append(`\n${funcs}`))
		.pipe(gulp.dest('./build'))
	})
}
