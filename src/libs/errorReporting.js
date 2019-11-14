/**
 * This hooks up our Sentry.io error reporting.
 */

const Raven = require('raven')

const errorReporting = {
	Raven,
	RavenGeneral: new Raven.Client(''),
	RavenMySQL: new Raven.Client(''),
}
// Raven General
errorReporting.RavenGeneral.config('').install()
// Raven MySQL
errorReporting.RavenMySQL.config('').install()

module.exports = errorReporting
