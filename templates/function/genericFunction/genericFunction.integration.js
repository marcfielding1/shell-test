import supertest from 'supertest'
import { expect } from 'chai'
import config from 'config'

const url = config.get('url')
const request = supertest(url)

describe('genericFunction', () => {
	it('GET', (done) => {
		request
		.get('/genericFunction')
		.set('Content-Type', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200)
		.end((err, res) => {
			expect(res).toExist()
			if (err) throw err
			done()
		})
	})
})
