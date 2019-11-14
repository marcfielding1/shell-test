/* eslint-disable no-unused-expressions */
import { resolve, reject } from 'bluebird'
import { expect } from 'chai'
import { getBalance } from '../functions/getBalance/balanceService'

const DEV_USER_ID = 1 // This is hardcoded user id on dev environment only
const mockLogger = {
	logger: {
		error: str => console.log('[ERROR]:', str),
		info: str => console.log('[INFO]:', str),
	},
}
describe('get balance', () => {
	it('gets balances', (done) => {
		getBalance(DEV_USER_ID, mockLogger).then((balanceResponse) => {
			expect(balanceResponse.summary.balances.total).to.not.be.undefined
			expect(balanceResponse.summary.balances.calculated).to.not.be.undefined
			expect(balanceResponse.list.meta).to.not.be.undefined
			expect(balanceResponse.list.items.length > 0).to.be.true
			expect(balanceResponse.list.items[0].breakdownCategory).to.not.be.undefined
			expect(balanceResponse.list.items[0].name).to.not.be.undefined
			expect(balanceResponse.list.items[0].amount.amount).to.not.be.undefined
			expect(balanceResponse.list.items[0].amount.currency).to.be('GBP')
			resolve(balanceResponse)
			done()
		}).catch((error) => {
			expect.fail(`Error: expected balance but instead found an error: ${error}`)
			reject(error)
			done()
		})
	})
})
