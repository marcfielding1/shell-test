import gulp from 'gulp'
import rename from 'gulp-rename'
import replace from 'gulp-string-replace'

export default function createFunction(name, done) {

	gulp.src('./templates/function/genericFunction/genericFunction.js')
		.pipe(rename(`${name}.js`))
		.pipe(gulp.dest(`./mockAPI/functions/${name}`))
}
