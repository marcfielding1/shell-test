import gulp, { parallel } from 'gulp'
import babel from 'gulp-babel'
import yamlconcat from './yamlconcat'
import copyFiles from './copyFiles'

const config = {
	sourceFiles: ['src/**/*.js', 'src/**/*.opts'],
}

function jsCompile() {
	return gulp.src(config.sourceFiles)
		.pipe(babel({
			presets: ['@babel/env'],
			plugins: [
				"@babel/transform-async-to-generator",
			],
			ignore: ['mocha.opts'],
		}))
		.pipe(gulp.dest('build'))
}

export default gulp.parallel(jsCompile, yamlconcat, copyFiles)
