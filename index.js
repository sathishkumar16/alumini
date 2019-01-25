const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed

const app = express()

const config = {
  channelAccessToken: '6X8Zw/lAUqyxqsniFZhDmJhdbpFOYt+ERQCJq9jOH7o6NtSshWwIQklgZeiZ1Yi6f00hGF4JqX8AxE8D7sYkNfoafiizE+MDFlATFW0kCCSN3+3KWYIwsWGCZXq9ZaZ/I+VduhP3l8snBQa/Ib7LGQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '2e1a43f6818c7c1191c23ca7797ae61f'
}

app.use(middleware(config))

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(8080)