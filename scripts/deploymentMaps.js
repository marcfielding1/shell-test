const deploymentVPCMap = {
	dev: {
		securityGroupIds: ['sg-0b0a2f223a9addf22'],
		subnetIds: ['subnet-010cda4a88040b29b'],
	},
	test: {
		securityGroupIds: ['sg-0b0a2f223a9addf22'],
		subnetIds: ['subnet-010cda4a88040b29b'],
	},
	prod: {
		securityGroupIds: ['sg-056507979a78c10f6'],
		subnetIds: ['subnet-064c7d79a06eb6f1f'],
	},
}

module.exports.vpc = (serverless) => {

	return deploymentVPCMap[process.env.NODE_ENV]

}
