import axios from 'axios'
import { expect } from 'chai'
import AWS from 'pulse-core-libs/SDKWrapper'

import PaginatedFetch from '../functions/codatDownload/paginatedFetch'
import { generateHandlerUtils } from './test-helpers'


const companyId = '1231f5fa-8de5-4f6f-991b-df26853307e8'
let client

describe('CodatDownloader', () => {
    before(async () => {
        const ssm = new AWS.SSM({ region: 'eu-west-2' });
        const { Parameter } = await ssm.getParameter({ Name: 'codatAPIKey-dev', WithDecryption: true }).promise()
        client = axios.create({ baseURL: 'https://api-uat.codat.io/', headers: { Authorization: Parameter.Value } })
    })

    it('should error with 404 for a missing resource', (done) => {
        const url = `/companies/${companyId}/data/not-a-real-endpoint`
        const fetch = new PaginatedFetch(url, {}, client, false, generateHandlerUtils(), {}, {})

		fetch.fetchData().then((res) => {
			expect.fail(`Error: endpoint should have failed but returned: ${res}`)
			done()
		}).catch((error) => {
            expect(error.message).to.equal('Genuine 404')
			done()
		})
	})

    it('should handle 404 for no data', (done) => {
        const url = `/companies/${companyId}/data/creditNotes`
        const fetch = new PaginatedFetch(url, {}, client, false, generateHandlerUtils(), {}, {})

		fetch.fetchData().then((res) => {
            expect(res, 'should resolve empty object').to.deep.equal({})
			done()
		}).catch((error) => {
			expect.fail(`Error: endpoint should not have failed with ${error}`)
			done()
		})
	})
})
