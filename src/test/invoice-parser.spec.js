// /* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import { expect } from 'chai'
import { parseInvoicesAndMerchants } from '../functions/getInvoicesHandler/invoiceParser'

const merchantCode = 'MER-123'
const merchantName = 'Merchant-X'

const sampleTransaction = {
	id: 123,
	referenceKey: 'INV-123',
	pulseStatus: 'OVERDUE',
	transactionType: 'INVOICE',
	grossAmount: {
		amount: 200,
		currencyCode: 'GBP',
		conversionRate: 1,
	},
	amountDue: {
		amount: 200,
		currencyCode: 'GBP',
		conversionRate: 1,
	},
	issueDate: '2019-03-01',
	dueDate: '2019-03-28',
	paidOnDate: '2019-04-01',
	merchantId: `${merchantCode}+${merchantName}`,
}

const partialTransaction = {
	id: 123,
	referenceKey: 'INV-123',
	pulseStatus: 'OVERDUE',
	transactionType: 'INVOICE',
	grossAmount: {
		amount: 300,
		currencyCode: 'GBP',
		conversionRate: 1,
	},
	amountDue: {
		amount: 200,
		currencyCode: 'GBP',
		conversionRate: 1,
	},
	issueDate: '2019-03-01',
	dueDate: '2019-03-28',
	paidOnDate: '2019-04-01',
	merchantId: `${merchantCode}+${merchantName}`,
}

describe('parseInvoicesAndMerchants', () => {
	it('it parses partial invoice, returns correct totals', (done) => {
		// Given
		const transactions = [partialTransaction]

		// When
		let [[parsedPartialInvoice], _, summary] = parseInvoicesAndMerchants(transactions)

		const expectedInvoice = {
			id: 123,
			dateDue: '2019-03-28',
			dateIssued: '2019-03-01',
			datePaid: '2019-04-01',
			merchantId: 'MER-123+Merchant-X',
			number: 'INV-123',
			status: 'OVERDUE',
			amount: {
				remaining: { currency: 'GBP', amount: 200 },
				invoiced: { currency: 'GBP', amount: 300 },
				paid: { currency: 'GBP', amount: 100 },
			},
		}

		const defaultAmount = { amount: 0, currency: 'GBP' }

		const expectedSummary = {
			overdue: {
				remaining: { currency: 'GBP', amount: 200 },
				invoiced: { currency: 'GBP', amount: 300 },
				paid: { currency: 'GBP', amount: 100 },
			},
			due: {
				remaining: defaultAmount,
				invoiced: defaultAmount,
				paid: defaultAmount,
			},
			paid: {
				paid: defaultAmount,
			},
		}

		// Then
		expect(parsedPartialInvoice).to.deep.equal(expectedInvoice)
		expect(summary).to.deep.equal(expectedSummary)
		done()
	})

	it('it calculates the total for 2 OVERDUE invoices', (done) => {
		// Given
		const transactions = [sampleTransaction, sampleTransaction]

		// When
		let [invoices, merchants, summary] = parseInvoicesAndMerchants(transactions)

		// Then
		expect(summary.overdue.remaining.amount === 400).to.be.true
		done()
	})

	it('it parses invoice', (done) => {
		// Given
		const transactions = [sampleTransaction]

		// When
		let [invoices] = parseInvoicesAndMerchants(transactions)

		// Then
		checkNullOrUndefined(invoices)
		expect(invoices.length === transactions.length).to.be.true
		for (let i = 0; i < invoices.length; i++) {
			const transaction = transactions[i]
			const invoice = invoices[i]
			checkInvoice(invoice, transaction)
		}
		done()
	})

	it('it parses merchants', (done) => {
		// Given
		const transactions = [sampleTransaction]

		// When
		let [invoices, merchants] = parseInvoicesAndMerchants(transactions)

		// Then
		checkNullOrUndefined(merchants)
		expect(merchants.length === transactions.length).to.be.true
		for (let i = 0; i < merchants.length; i++) {
			const transaction = transactions[i]
			const merchant = merchants[i]
			checkMerchant(merchant, transaction)
		}
		done()
	})
})

// Private helpers

const checkNullOrUndefined = (object) => {
	expect(object).to.not.be.undefined
	expect(object).to.not.be.null
}

const checkInvoice = (invoice, transaction) => {
	expect(invoice.id).to.equal(transaction.id)
	expect(invoice.number).to.equal(transaction.referenceKey)
	expect(invoice.status).to.equal(transaction.pulseStatus)
	if ((transaction.pulseStatus === 'OVERDUE') || (transaction.pulseStatus === 'DUE')) {
		expect(invoice.amount.remaining.amount).to.equal(transaction.amountDue.amount)
		expect(invoice.amount.remaining.currency).to.equal(transaction.amountDue.currencyCode)

		expect(invoice.totalAmount.amount).to.equal(transaction.amountDue.amount)
		expect(invoice.totalAmount.currency).to.equal(transaction.amountDue.currencyCode)
	} else {
		expect(invoice.amount.remaining.amount).to.equal(transaction.grossAmount.amount)
		expect(invoice.amount.remaining.currency).to.equal(transaction.grossAmount.currencyCode)

		expect(invoice.totalAmount.amount).to.equal(transaction.amountDue.amount)
		expect(invoice.totalAmount.currency).to.equal(transaction.amountDue.currencyCode)
	}
	expect(invoice.dateIssued).to.equal(transaction.issueDate)
	expect(invoice.dateDue).to.equal(transaction.dueDate)
	expect(invoice.datePaid).to.equal(transaction.paidOnDate)
	expect(invoice.merchantId).to.equal(transaction.merchantId)
}

const checkMerchant = (merchant, transaction) => {
	expect(merchant.id).to.equal(transaction.merchantId)
}
