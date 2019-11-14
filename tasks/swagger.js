/* eslint no-console: 0 */

import SwaggerParser from 'swagger-parser'
import YAML from 'yamljs'
import config from 'config'
import fs from 'fs'
import createFunction from './createFunction'

const isDev = process.env.NODE_ENV !== 'production'
const stripFunction = fn => !isDev && (fn.devOnly === true)

export default function swagger() {
	const parser = new SwaggerParser()
	const swaggerUrl = config.get('swaggerUrl')

	return parser.parse(swaggerUrl)
	.then((api) => {
		const yamlObject = { functions: {} }
		let apiJSON = JSON.stringify(api)

		// x-something is used by swagger to allow user defined properties, we need to remove the x- so it actually works!
		let minusX = apiJSON.replace(/x-/g, '')

		Object.entries(JSON.parse(minusX).paths).forEach(([path, methods]) => {
			Object.entries(methods).forEach(([method, handler]) => {

				// strips devOnly functions in production environment
				if (stripFunction(handler)) return

				if (handler.operationId) {
					const operation = handler.operationId
					const funcObj = {
						handler: `handler.${operation}`,
						events: [{
							http: {
								path,
								method,
								cors: true,
							},
						}],
					}


					if (handler.authorizer) {
						funcObj.events[0].http.authorizer = handler.authorizer
					}

					if (handler.deploymentSettings) {
						funcObj.deploymentSettings = handler.deploymentSettings
					}

					yamlObject.functions[operation] = funcObj

					fs.access(`./src/functions/${operation}`, () => {
					})
				}
			})
		})

		Object.entries(JSON.parse(minusX).functions).forEach((func) => {
			// this is rubbish need to refactor
			if(func[1].handler){
				const events = func[1].events
				const funcObject = {
					handler: func[1].handler,
				}

				if (events != null) {
					funcObject.events = events
				}
				if(func[1].timeout){
					funcObject.timeout = func[1].timeout
				}

				if(typeof func[1].resultTtlInSeconds !== 'undefined'){
					funcObject.resultTtlInSeconds = func[1].resultTtlInSeconds
				}

				yamlObject.functions[func[0]] = funcObject

			} else {
				yamlObject.functions[func[0]] = func[1]
			}
		})

		return YAML.stringify(yamlObject, 10, 2)
	})
}
