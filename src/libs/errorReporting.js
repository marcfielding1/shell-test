/**
 * This hooks up our Sentry.io error reporting.
 */

const Raven = require('raven')

const errorReporting = {
	Raven,
	RavenGeneral: new Raven.Client('https://af6cbb2844f84b04a2b1b3a2568425fc@sentry.io/1352005'),
	RavenMySQL: new Raven.Client('https://af6cbb2844f84b04a2b1b3a2568425fc@sentry.io/1352005'),
}
// Raven General
errorReporting.RavenGeneral.config('https://af6cbb2844f84b04a2b1b3a2568425fc@sentry.io/1352005').install()
// Raven MySQL
errorReporting.RavenMySQL.config('https://af6cbb2844f84b04a2b1b3a2568425fc@sentry.io/1352005').install()

module.exports = errorReporting
