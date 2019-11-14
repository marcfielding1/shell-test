/* eslint import/prefer-default-export: 0 */
let elasticsearch = require('elasticsearch')

const es = new elasticsearch.Client({
	host: 'TTHS:ZXUtd2VzdC0xLmF3cy5mb3VuZC5pbyRlNDQ3MGE2OTFkODk0NmU2YjI2NzhkN2I4YjBlZDA4MSQ1MjRhNjVjYWU1NTA0MmExOGEzOGU3YmFmYTA2MTI5Yg==',
})

module.exports = es
