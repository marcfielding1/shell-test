/* eslint-disable no-unused-expressions */
import { resolve, reject } from 'bluebird'
import { expect } from 'chai'
import { getInvoices } from '../functions/getInvoicesHandler/invoiceService'

const DEV_USER_ID = 1 // This is hardcoded user id on dev environment only
describe('get transactions (invoices)', () => {
	it('gets transactions (invoices)', (done) => {
		getInvoices(DEV_USER_ID).then((invoiceResponse) => {
			expect(invoiceResponse.list.meta).to.not.be.undefined
			expect(invoiceResponse.list.items.length > 0).to.be.true
			expect(invoiceResponse.list.associatedData.merchants.length > 0).to.be.true
			expect(invoiceResponse.list.total).to.not.be.undefined
			resolve(invoiceResponse)
			done()
		}).catch((error) => {
			expect.fail(`Error: expected transactions (invoices) but instead found an error: ${error}`)
			reject(error)
			done()
		})
	})
})
