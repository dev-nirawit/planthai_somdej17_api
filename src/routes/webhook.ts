import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
// import { NextFunction } from 'connect';
// import * as express from 'express';
import { Router, Request, Response } from 'express';
// import axios from 'axios';
// const URL_API_SYNC_HIS = process.env.URL_API_LINE_MESSAGE_API;
// axios.defaults.baseURL = URL_API_SYNC_HIS;
// const line = require('@line/bot-sdk');
// const client = new line.Client({
//     channelAccessToken: process.env.LINE_OA_ACCESS_TOKEN
// });

// const client = new Client({
//     channelAccessToken: process.env.LINE_OA_ACCESS_TOKEN,
//     channelSecret: process.env.LINE_OA_CHANNEL_SECRET
// });


// const config = {
//     channelAccessToken: process.env.LINE_OA_ACCESS_TOKEN,
//     channelSecret: process.env.LINE_OA_CHANNEL_SECRET
// };
// create LINE SDK client
// const client = new line.Client(config);

import { LineClient } from 'messaging-api-line';
const { Line } = require('messaging-api-line');
// // get accessToken and channelSecret from LINE developers website
const client = new LineClient({
    accessToken: process.env.LINE_OA_ACCESS_TOKEN,
    channelSecret: process.env.LINE_OA_CHANNEL_SECRET,
});

import { ManagerModel } from '../models/manager.model';
import { LineLiffModel } from '../models/line_liff_model';
import { Jwt } from '../models/jwt';

const jwt = new Jwt();
const lineliffModel = new LineLiffModel();
const managerModel = new ManagerModel();
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        res.send({ ok: true, message: 'Welcome to RESTful api #WEBHOOK Fontend Liff!', code: HttpStatus.OK });
    } catch (error) {
        console.log(error);
        res.send({ ok: false, message: error.message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    // var data = req.body.events
    var data = req.body.events[0];
    try {
        // console.log(data)
        // client.replyText(data.replyToken, 'data.message[0].text');

        if (data.message.text == 'ติดต่อเรา') {

            // client.replyLocation(data.replyToken, {
            //     title: 'แผนที่ (เริ่มนำทาง)',
            //     address: 'โรงพยาบาลสมเด็จพระสังฆราช องค์ที่ 17',
            //     latitude: 14.2253369,
            //     longitude: 100.0263045,
            // });
            // Line.replyText(data.replyToken, 'ติดต่อสอบถาม\nงานการแพทย์แผนไทยและแพทย์ทางเลือก\nโรงพยาบาลสมเด็จพระสังฆราชองค์ที่ 17\nอาคารอำนวยการ ชั้น 6\nโทร 0-35531077 ต่อ 1606-7\nมือถือ 098-9929811'),
            client.reply(data.replyToken, [
                Line.createText('ติดต่อสอบถาม\nงานการแพทย์แผนไทยและแพทย์ทางเลือก\nโรงพยาบาลสมเด็จพระสังฆราชองค์ที่ 17\nอาคารอำนวยการ ชั้น 6\nโทร 0 3553 1077 ต่อ 1606,1607\nมือถือ 09 8992 9811'),
                Line.createLocation({
                    title: 'แผนที่ (เริ่มนำทาง)',
                    address: 'โรงพยาบาลสมเด็จพระสังฆราช องค์ที่ 17',
                    latitude: 14.2253369,
                    longitude: 100.0263045,
                })
            ]);
        }

        if (data.replyToken) {
            res.send({ ok: true, code: HttpStatus.OK });
        }


        // if (event.type === 'message') {
        //     const message = event.message;

        //     if (message.type === 'text' && message.text === 'bye') {
        //         if (event.source.type === 'room') {
        //             client.leaveRoom(event.source.roomId);
        //         } else if (event.source.type === 'group') {
        //             client.leaveGroup(event.source.groupId);
        //         } else {
        //             client.replyMessage(event.replyToken, {
        //                 type: 'text',
        //                 text: 'I cannot leave a 1-on-1 chat!',
        //             });
        //         }
        //     }
        // }
        // res.json(data)


    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

export default router;