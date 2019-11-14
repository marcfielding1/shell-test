var dir = require('require-dir')
var gulp = require('gulp')

const tasks = dir('./tasks')
const build = require('./tasks/build')
Object.keys(tasks).forEach((taskName) => {
	gulp.task(taskName, tasks[taskName].default)
})
