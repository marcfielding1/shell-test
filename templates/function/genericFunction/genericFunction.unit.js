import { expect } from 'chai'

import genericFunction from './genericFunction'

describe('genericFunction', () => {
	it('GET', (done) => {
		const expected = { message: 'Hello world' }
		const callback = (err, result) => {
			expect(err).toBe(null)
			expect(result).toEqual(expected)
			done()
		}
		return genericFunction({}, callback)
	})
})
