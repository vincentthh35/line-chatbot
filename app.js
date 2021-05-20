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
const replyType = [
    'unfollow',
    'join',
    'follow',
    'leave',
    'message'
];
import corpus from './document/corpus.json';
import sticker, { genStickerMessage, randomSticker } from './sticker.js';
import social from './document/social.json';
import flex_greeting from './document/greeting.json';
import flex_intro from './document/intro.json';
import flex_ml from './document/ml.json';
import flex_web from './document/web.json';
import flex_c from './document/c.json';
import flex_hobby from './document/hobby.json';
import querystring from 'querystring';

const handleText = (message, replyToken) => {
    switch (message.text) {
        // social media
        case 'facebook':
        case 'Facebook':
        case 'fb':
        case 'FB':
        case 'Fb':
        case 'email':
        case 'Email':
        case 'EMail':
        case 'website':
        case 'Website':
        case 'WebSite':
        case '個人網站':
        case 'github':
        case 'Github':
        case 'GitHub':
        case 'django':
        case 'Django':
        case 'Leetcode':
        case 'leetcode':
        case '簡易爬蟲網站':
        case '爬蟲網站':
            console.log(`replying ${message.text}`);
            let text = message.text.toLowerCase()
            if (text === 'fb') {
                text = 'facebook';
            } else if (text === '個人網站') {
                text = 'website';
            } else if (text === '簡易爬蟲網站' || text === '爬蟲網站') {
                text = 'django';
            }
            return client.replyMessage(replyToken, {
                type: 'text',
                text: `這是我的${social[text].title}：\n${social[text].content}`
            });
            break;
        case 'favorite song':
        case '聽一下你最喜歡的曲子':
            console.log(`replying favorite song`);
            return client.replyMessage(replyToken, {
                type: 'text',
                text: `這是我最喜歡的曲子：\n${corpus.favorite_song}`
            })
            break;
        // self introduction
        case '自我介紹一下':
        case '自我介紹':
        case '回到自我介紹':
            console.log(`replying 自我介紹`);
            return client.replyMessage(replyToken, {
                type: 'flex',
                contents: flex_intro,
                altText: corpus.intro_alt
            });
            break;
        case '機器學習相關':
            console.log(`replying machine learning`);
            return client.replyMessage(replyToken, {
                type: 'flex',
                contents: flex_ml,
                altText: corpus.ml_alt
            });
            break;
        case 'C/C++':
        case 'C/c++':
        case 'c/c++':
            console.log(`replyingC/C++`);
            return client.replyMessage(replyToken, {
                type: 'flex',
                contents: flex_c,
                altText: corpus.c_alt
            })
            break;
        case '網頁相關':
            console.log(`replying web`);
            return client.replyMessage(replyToken, {
                type: 'flex',
                contents: flex_web,
                altText: corpus.web_alt
            })
            break;
        case '興趣':
            console.log(`replying hobby`);
            return client.replyMessage(replyToken, {
                type: 'flex',
                contents: flex_hobby,
                altText: corpus.hobby_alt
            })
            break;
        default:
            // default: return random sticker
            return client.replyMessage(replyToken, genStickerMessage(randomSticker()));
    }

};

const handleMessage = (message, replyToken, source) => {
    switch (message.type) {
        case 'text':
            // handle text message
            return handleText(message, replyToken, source);
            break;
        // case 'image':
        //     // image
        //     break;
        // case 'video':
        //     // video
        //     break;
        // case 'audio':
        //     // audio
        //     break;
        case 'sticker':
            // sticker messages
            // message.keywords is an array containing sticker keywords
            break;
        default:
            reply_message.text = corpus.unknown_text;
            break;
    }
};

function handleEvent(event) {
    // catch webhook verification?
    // if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    //     console.log(`Test hook recieved: ${JSON.stringify(event.message)}`);
    //     return Promise.resolve(null);
    // }

    // no response
    if (!replyType.includes(event.type)) {
        return Promise.resolve(null);
    }

    let reply_message = { type: 'text', text: 'default reply' };
    switch (event.type) {
        case 'message':
            // handle message
            console.log(`message: ${JSON.stringify(event)}`);
            return handleMessage(event.message, event.replyToken, event.source);
            break;
        case 'join':
        case 'follow':
            // greeting here
            console.log(`join/follow: ${JSON.stringify(event)}`);
            return client.pushMessage(event.source.userId, genStickerMessage(sticker.helloSticker))
                .then(() => {
                    return client.replyMessage(event.replyToken, {
                        altText: corpus.greeting_alt,
                        type: 'flex',
                        contents: flex_greeting
                    });
                });
            break;
        case 'leave':
            console.log(`leave: ${JSON.stringify(event)}`);
            return Promise.resolve(null);
            break;
        case 'unfollow':
            console.log(`unfollow: ${JSON.stringify(event)}`);
            return Promise.resolve(null);
        default:
            console.log(`event: ${JSON.stringify(event)}`);
            return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, reply_message)
        .catch((error) => { console.error(error.message); });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});
