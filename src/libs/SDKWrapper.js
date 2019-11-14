const bluebird = require('bluebird')
const AWS = require('aws-sdk')

AWS.config.setPromisesDependency(bluebird)

module.exports = AWS
