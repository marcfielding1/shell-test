import { expect } from 'chai'
import { parseBalance } from '../functions/getBalance/balanceParser'

const now = new Date()
const todayDateString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`

const exampleCurrentBalance = { currencyCode: 'GBP', amount: 1337 }
const exampleTaxSummary = { accrued: [{ fromDate: '1970-01-01', toDate: todayDateString, type: 'vat', amountIn: { amount: 100, currencyCode: 'GBP' }, amountOut: { amount: 3, currencyCode: 'GBP' } }], payments: ['something'] }

const nullCurrentBalance = {}
const nullTaxSummary = {}

describe('parseBalance', () => {
	it('it parses balance, returns correct summary and breakdowns', (done) => {
		// Given
		const currentBalance = exampleCurrentBalance
		const taxSummary = exampleTaxSummary

		// When
		let { balanceBreakdowns, summary } = parseBalance(currentBalance, taxSummary)

		const expectedBalanceBreakdowns = [
			{
				breakdownCategory: 'TAX',
				name: 'vat',
				amount: {
					currency: 'GBP',
					amount: -97,
				},
			},
		]

		const expectedSummary = {
			balances: {
				total: {
					currency: 'GBP',
					amount: 1337,
				},
				calculated: {
					currency: 'GBP',
					amount: 1240,
				},
			},
		}

		// Then
		expect(balanceBreakdowns).to.deep.equal(expectedBalanceBreakdowns)
		expect(summary).to.deep.equal(expectedSummary)
		done()
	})
})
