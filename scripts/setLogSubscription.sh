aws logs describe-log-groups | grep logGroupName | while read line ; do \
aws logs put-subscription-filter --log-group-name $(echo $line) \
--filter-name lambdaLogger --destination-arn $(aws lambda get-function-configuration --function-name pulse-API-${NODE_ENV}-lambdaLogger --region eu-west-2 | grep FunctionArn | sed 's/\"FunctionArn\":/ /') --filter-pattern ""; done
 