// const express = require('express');
// const line = require('@line/bot-sdk');
import express from 'express';
import line from '@line/bot-sdk';

// get env vars
import dotenv from 'dotenv-defaults';
dotenv.config();


const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});
