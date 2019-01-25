'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: '2e1a43f6818c7c1191c23ca7797ae61f',
  channelSecret: '6X8Zw/lAUqyxqsniFZhDmJhdbpFOYt+ERQCJq9jOH7o6NtSshWwIQklgZeiZ1Yi6f00hGF4JqX8AxE8D7sYkNfoafiizE+MDFlATFW0kCCSN3+3KWYIwsWGCZXq9ZaZ/I+VduhP3l8snBQa/Ib7LGQdB04t89/1O/w1cDnyilFU=',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();


app.get('/', function (req, res) {
  res.send('Line API is Running')
})

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = 80;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});