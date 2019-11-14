import { expect } from 'chai'
import sinon from 'sinon'


function getSomething() {
	return true
}

describe('someFunction', () => {
	it('it does something', (done) => {
		getSomething()
		done()
	})
})
