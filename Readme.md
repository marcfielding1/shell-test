### Architecture Diagram

![Alt text](/ArchitectureDiagram.png?raw=true "Optional Title")



### Quick Start

Please note that I've included these instructions but they won't work locally without AWS access keys, I CAN create a user but it's probably easier just to use the deployed version.

```
endpoints:
  POST - https://2deizqvxk5.execute-api.eu-west-2.amazonaws.com/dev/arrival
  GET - https://2deizqvxk5.execute-api.eu-west-2.amazonaws.com/dev/history/{captain}
```

Clone this repo.

```
npm i -g gulp-cli serverless serverless-offline
```

At project root
```
$ npm i
$ gulp build 
```
Gulp build will compile the various resources to the build directory when the build directory is first created you'll need to do an npm install in there.
```aidl
$ cd build
$ npm i
$ sls offline
```

All being well you should see serverless fire up and you'll have the API running on localhost.

### Install
### Prerequisites 

###
Please ensure that the Development Machine has following,

* Nodejs (8.10)
* gulp(4.0) with gulp cli(1.2.) - [Install Instructions](https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html) - globally
* serverless & serverless-offline  - globally
