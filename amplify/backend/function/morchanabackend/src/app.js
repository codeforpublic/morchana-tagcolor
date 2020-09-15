/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
  AUTH_MORCHANABACKEND1D4D7DBA_USERPOOLID
  ENV
  REGION
Amplify Params - DO NOT EDIT */

const MorchanApi = require('./morchana')
const morchana = new MorchanApi()
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-1' })
const s3 = new AWS.S3()

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// BEGIN

app.get('/backend/batch', async function (req, res) {
  let result = {}
  try {
    let res
    const processingList = []
    res = await s3
      .listObjects({
        Bucket: 'backend-s3',
        Delimiter: '/',
        Prefix: 'processing/'
      })
      .promise()
    if (res.Contents && res.Contents.length > 1) {
      for (let i = 1; i < res.Contents.length; i++) {
        processingList.push({
          file: res.Contents[i].Key.split('/')[1].split('.')[0]
        })
      }
    }

    const doneList = []
    res = await s3
      .listObjects({
        Bucket: 'backend-s3',
        Delimiter: '/',
        Prefix: 'done/'
      })
      .promise()
    if (res.Contents && res.Contents.length > 1) {
      for (let i = 1; i < res.Contents.length; i++) {
        doneList.push({
          file: res.Contents[i].Key.split('/')[1].split('.')[0]
        })
      }
    }

    result = {
      status: 'ok',
      processing: processingList,
      done: doneList
    }
  } catch (e) {
    result = {
      status: 'error',
      error: e.message
    }
  }
  res.json(result)
})

app.get('/backend/tags', async function (req, res) {
  const result = await morchana.tags()
  res.json(JSON.parse(result))
})

app.post('/backend/createTag', async function (req, res) {
  const params = req.body
  const result = await morchana.createTag(params)
  res.json(JSON.parse(result))
})

app.post('/backend/batch', async function (req, res) {
  let result = {}
  try {
    const fileKey = Date.now().toString()
    const fileName = 'processing/' + fileKey + '.csv'
    const destparams = {
      Bucket: 'backend-s3',
      Key: fileName,
      Body: req.body,
      ContentType: 'text'
    }

    await s3.putObject(destparams).promise()

    result = {
      status: 'ok',
      file: fileKey
    }
  } catch (e) {
    result = {
      status: 'error',
      error: e.message
    }
  }
  res.json(result)
})

// END

/**********************
 * Example get method *
 **********************/
/*
app.get('/backend', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url })
})

app.get('/backend/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url })
})
*/
/****************************
* Example post method *
****************************/
/*
app.post('/backend', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

app.post('/backend/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})
*/
/****************************
* Example put method *
****************************/
/*
app.put('/backend', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

app.put('/backend/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})
*/
/****************************
* Example delete method *
****************************/
/*
app.delete('/backend', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

app.delete('/backend/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})
*/

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
