import gulp from 'gulp'
import merge from 'merge-stream'

export default function copyFiles() {

	const config = gulp.src('config/**/*')
        .pipe(gulp.dest('./build/config'))

	const pack = gulp.src('package.json').pipe(gulp.dest('./build'))

	return merge(config, pack)
}
