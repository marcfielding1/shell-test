#!/bin/bash

# Execute for pull requests to develop
cd build && sls deploy --stage test
export NODE_ENV=test && npm run integration