import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
// import { NextFunction } from 'connect';
// import * as express from 'express';
import { Router, Request, Response } from 'express';
// import axios from 'axios';
const { LineClient } = require('messaging-api-line');
// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
    accessToken: process.env.LINE_OA_ACCESS_TOKEN,
    channelSecret: process.env.LINE_OA_CHANNEL_SECRET,
});
var multer = require('multer');

import { ManagerModel } from '../models/manager.model';
import { LineLiffModel } from '../models/line_liff_model';
// import { Jwt } from '../models/jwt';

// const jwt = new Jwt();
const lineliffModel = new LineLiffModel();
const managerModel = new ManagerModel();
const router: Router = Router();

const upliadFileData = { filename: '', status: false, nofile: true };
// Multer File upload settings
const DIR = './upload/avatar/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        // const fileName = file.originalname.toLowerCase().split(' ').join('-');

        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.mimetype.replace('image/', '.');
        console.log(file);

        upliadFileData.filename = fileName;
        cb(null, fileName)
    }
});
// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
            upliadFileData.status = true;
            upliadFileData.nofile = false;
        } else {
            cb(null, false);
            upliadFileData.status = false;
            upliadFileData.nofile = false;
            // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/service_list', async (req: Request, res: Response) => {
    try {
        let rs = await lineliffModel.getservice_planthai(req.db);
        console.log(rs);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/service_planthai', async (req: Request, res: Response) => {
    let data = req.body.data;
    try {
        console.log(data);
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
})

router.get('/service_list_more/:id', async (req: Request, res: Response) => {
    let id = req.params.id
    try {
        let rs = await lineliffModel.getServicePlanthaiMore(req.db, id);
        console.log(rs);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.get('/getmember_list', async (req: Request, res: Response) => {
    try {
        let rs = await managerModel.getMemberList(req.db);
        let rsAdmin = await managerModel.getMemberList(req.db, 'admin');
        let rsSuperAdmin = await managerModel.getMemberList(req.db, 'superAdmin');
        res.send({ ok: true, rows_member: rs, rows_admin: rsAdmin, rows_superadmin: rsSuperAdmin, code: HttpStatus.OK });
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.get('/get_holiday', async (req: Request, res: Response) => {
    try {
        const rs: any = await managerModel.getHolidayAll(req.db);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK })
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/save_holiday', async (req: Request, res: Response) => {
    let holidayDate = req.body.data.holiday_date;
    let holidayName = req.body.data.holiday_name;
    let dataType = req.body.data.data_type || 'add';
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');

    try {

        const ck = await managerModel.holidayDate(req.db, holidayDate)
        const rawdata = {
            holiday_date: holidayDate,
            holiday_name: holidayName,
            ref_member_id: req.decoded.member_id,
            ref_datetime: datetime
        }
        let rs: any;
        if (dataType == 'edit' && ck.length == 1) {
            rs = await managerModel.updateHoliday(req.db, rawdata, holidayDate)
        } else {
            rs = await managerModel.saveHoliday(req.db, rawdata)
        }
        res.send({ ok: true, rows: rs, code: HttpStatus.OK })
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.delete('/del_holiday', async (req: Request, res: Response) => {
    let dataDate = req.body.data;
    try {
        // console.log(dataDate);
        await managerModel.delHoliday(req.db, dataDate);
        res.send({ ok: true, code: HttpStatus.OK });
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.get('/special_day', async (req: Request, res: Response) => {
    try {
        let rs = await managerModel.getSpecialDay(req.db);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK })
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/special_day', async (req: Request, res: Response) => {
    let data = req.body.data;
    let dataType = req.body.data.data_type || 'add';
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const Id: number = parseInt(data.id)
    try {
        // console.log(req.body.data)
        const ck = await managerModel.specialDayDate(req.db, data.date, data.bookingtime_items)
        // console.log(ck.length);
        const rawdata = {
            date: data.date,
            num: data.num,
            ref_booking_limit_id: data.bookingtime_items,
            ref_member_id: req.decoded.member_id,
            ref_datetime: datetime
        }
        let rs: any;
        if (dataType == 'edit' && Id != null && ck.length == 1) {
            rs = await managerModel.updateSpecialDay(req.db, rawdata, Id)
            res.send({ ok: true, rows: rs, code: HttpStatus.OK })
        } else if (dataType == 'add' && ck.length == 0) {
            rs = await managerModel.saveSpecialDay(req.db, rawdata)
            res.send({ ok: true, rows: rs, code: HttpStatus.OK })
        } else if (dataType == 'add' && ck.length == 1) {
            res.send({ ok: false, message: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจากมีการบันทึกข้อมูลซ้ำ!!!', code: HttpStatus.PARTIAL_CONTENT })
        } else {
            res.send({ ok: false, message: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจากไม่ตรงเงื่อนไขที่กำหนด', code: HttpStatus.PARTIAL_CONTENT })
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.delete('/special_day', async (req: Request, res: Response) => {
    let Id = req.body.data;
    try {
        console.log(Id);
        await managerModel.delSpecialDay(req.db, Id);
        res.send({ ok: true, code: HttpStatus.OK });
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.put('/update_memberstatus', async (req: Request, res: Response) => {
    let data = req.body.data;
    try {
        if (data.member_id != null) {
            let rs: any = await managerModel.updateMemberStatus(req.db, data)
            res.send({ ok: true, code: HttpStatus.OK });
        } else {
            res.send({ ok: false, message: 'NO userID!!!!!', code: HttpStatus.NO_CONTENT })

        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.get('/get_manager_q', async (req: Request, res: Response) => {
    var date = req.params.date;
    try {
        let rs_sp: any = await lineliffModel.getservice_planthai(req.db);
        let rs_wait: any;
        let rs_confirm: any;
        let rs_q_full: any;
        let playload_wait = [];
        let playload_confirm = [];
        let playload_q = [];
        for (let index = 0; index < rs_sp.length; index++) {

            rs_wait = await managerModel.getManagerOrderBookingWaitConfirm(req.db, rs_sp[index].id)
            rs_confirm = await managerModel.getManagerOrderBookingConfirm(req.db, rs_sp[index].id)
            rs_q_full = await managerModel.getManagerOrderBookingQFull(req.db, rs_sp[index].id)

            let playload_wait_raw = {
                [rs_sp[index].id]: rs_wait
            }
            playload_wait.push(playload_wait_raw);

            let playload_confirm_raw = {
                [rs_sp[index].id]: rs_confirm
            }
            playload_confirm.push(playload_confirm_raw);

            let playload_q_raw = {
                [rs_sp[index].id]: rs_q_full
            }
            playload_q.push(playload_q_raw);

        }

        let playload_all = {
            q_wait: playload_wait,
            q_confirm: playload_confirm,
            q_full: playload_q
        }

        res.send({ ok: true, rows: playload_all, name_rows: rs_sp, code: HttpStatus.OK });
        // let rs: any = await lineliffModel.getManagerOrderBookingWaitConfirm(req.db);

        // if (rs.length) {
        //   res.send({ ok: true, rows: rs, code: HttpStatus.OK });
        // } else {
        //   res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.OK })
        // }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.put('/approved_q', async (req: Request, res: Response) => {
    let data = req.body.data;
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        console.log(data);
        if (data.id) {
            let ck: any = await lineliffModel.checkLiffFirst(req.db, req.decoded.line_userId)
            if (ck[0].member_status_level == 'admin' || ck[0].member_status_level == 'superAdmin') {
                const dataupdate = {
                    id: data.id,
                    userId: req.decoded.line_userId,
                    datetime: datetime,
                    approved_member_id: ck[0].member_id
                }
                let getLineToken: any = await lineliffModel.getUserProfileMemberId(req.db, data.member_id)
                // console.log(getLineToken[0].member_line_userId);
                let approvedStatusApproval: any = await managerModel.approvedStatusApproval(req.db)

                client.pushFlex(getLineToken[0].member_line_userId, 'แจ้งเตือนรายการ รับจองคิว',
                    {
                        "type": "bubble",
                        "header": {
                            "type": "box",
                            "layout": "vertical",
                            "flex": 0,
                            "backgroundColor": "#FFFFFFFF",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "none",
                                    "contents": [
                                        {
                                            "type": "image",
                                            "url": "https://planthai-line.somdej17service.com/somdej17logo.png",
                                            "flex": 1,
                                            "margin": "xs",
                                            "align": "start",
                                            "size": "xxs",
                                            "aspectMode": "fit"
                                        },
                                        {
                                            "type": "text",
                                            "text": "แจ้งเตือนรายการ [รับจองคิว]",
                                            "weight": "bold",
                                            "size": "md",
                                            "color": "#2E7D32",
                                            "flex": 5,
                                            "align": "center",
                                            "gravity": "center",
                                            "wrap": true,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        "hero": {
                            "type": "image",
                            "url": `${data.service_img_url}`,
                            "size": "full",
                            "aspectRatio": "20:13",
                            "aspectMode": "cover"
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": `${data.service_name}`,
                                    "weight": "bold",
                                    "size": "lg",
                                    "color": "#0096FFFF",
                                    "contents": []
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "none",
                                    "margin": "xs",
                                    "contents": [
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "เลขการจอง",
                                                    "size": "md",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.id}`,
                                                    "size": "xxl",
                                                    "color": "#FF3100FF",
                                                    "flex": 4,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "none",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "วันที่จอง",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.inorder_booking_date}`,
                                                    "weight": "bold",
                                                    "size": "md",
                                                    "color": "#666666",
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "none",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "ช่วงเวลา",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.booking_name} (${data.booking_time_start.substring(0, 5)} - ${data.booking_time_end.substring(0, 5)})`,
                                                    "size": "md",
                                                    "color": `${data.color_row}`,
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "sm",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "สถานะ",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${approvedStatusApproval[0].approved_status_name}`,
                                                    "size": "lg",
                                                    "color": "#009505FF",
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "none",
                                    "margin": "xl",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": `${approvedStatusApproval[0].approved_status_note}`,
                                            "size": "xs",
                                            "color": "#AAAAAA",
                                            "align": "center",
                                            "margin": "none",
                                            "wrap": true,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                );
                await managerModel.updateApprovedQ(req.db, dataupdate)
                // console.log(data);
                res.send({ ok: true, code: HttpStatus.OK });
            } else {
                res.send({ ok: false, code: HttpStatus.UNAUTHORIZED });
            }
        } else {
            res.send({ ok: false, message: 'NO userID!!!!!', code: HttpStatus.NO_CONTENT })
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/alert_q', async (req: Request, res: Response) => {
    let data = req.body.data;
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        if (req.decoded.line_userId) {
            let ck: any = await lineliffModel.checkLiffFirst(req.db, req.decoded.line_userId)
            if (ck[0].member_status_level == 'admin' || ck[0].member_status_level == 'superAdmin') {
                // const dataraw = {
                //     id: data.id,
                //     userId: req.decoded.line_userId,
                //     datetime: datetime,
                //     approved_member_id: ck[0].member_id
                // }
                // console.log(dataraw);

                // await managerModel.logAlertQ(req.db, approved_member_id)
                let getLineToken: any = await lineliffModel.getUserProfileMemberId(req.db, data.member_id)
                // console.log(getLineToken[0].member_line_userId);
                // client.pushText('U190074374a43d7f6354155264b726e3a', 'Hello!');

                // console.log(data.booking_time_start.substring(0, 5));

                client.pushFlex(getLineToken[0].member_line_userId, 'แจ้งเตือนรายการจองคิว',
                    {
                        "type": "bubble",
                        "header": {
                            "type": "box",
                            "layout": "vertical",
                            "flex": 0,
                            "backgroundColor": "#FFFFFFFF",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "xs",
                                    "margin": "none",
                                    "contents": [
                                        {
                                            "type": "image",
                                            "url": "https://planthai-line.somdej17service.com/somdej17logo.png",
                                            "flex": 1,
                                            "margin": "xs",
                                            "align": "start",
                                            "size": "xxs",
                                            "aspectMode": "fit"
                                        },
                                        {
                                            "type": "text",
                                            "text": "แจ้งเตือนรายการจองคิว",
                                            "weight": "bold",
                                            "size": "lg",
                                            "color": "#FF0000FF",
                                            "flex": 5,
                                            "align": "center",
                                            "gravity": "center",
                                            "wrap": true,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        },
                        "hero": {
                            "type": "image",
                            "url": `${data.service_img_url}`,
                            "size": "full",
                            "aspectRatio": "20:13",
                            "aspectMode": "cover"
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": `${data.service_name}`,
                                    "weight": "bold",
                                    "size": "lg",
                                    "color": "#0096FFFF",
                                    "contents": []
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "none",
                                    "margin": "xs",
                                    "contents": [
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "เลขการจอง",
                                                    "size": "md",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.id}`,
                                                    "size": "xxl",
                                                    "color": "#FF3100FF",
                                                    "flex": 4,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "none",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "วันที่จอง",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.inorder_booking_date}`,
                                                    "weight": "bold",
                                                    "size": "md",
                                                    "color": "#666666",
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "none",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "ช่วงเวลา",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.booking_name} (${data.booking_time_start.substring(0, 5)} - ${data.booking_time_end.substring(0, 5)})`,
                                                    "size": "md",
                                                    "color": `${data.color_row}`,
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "spacing": "sm",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "text": "สถานะ",
                                                    "size": "md",
                                                    "color": "#AAAAAA",
                                                    "flex": 2,
                                                    "contents": []
                                                },
                                                {
                                                    "type": "text",
                                                    "text": `${data.approved_status_name}`,
                                                    "size": "lg",
                                                    "color": "#009505FF",
                                                    "flex": 4,
                                                    "wrap": true,
                                                    "contents": []
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "none",
                                    "margin": "xl",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": `${data.approved_status_note}`,
                                            "size": "xs",
                                            "color": "#AAAAAA",
                                            "align": "center",
                                            "margin": "none",
                                            "wrap": true,
                                            "contents": []
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                );

                res.send({ ok: true, code: HttpStatus.OK });
            } else {
                res.send({ ok: false, code: HttpStatus.UNAUTHORIZED });
            }
        } else {
            res.send({ ok: false, message: 'NO userID!!!!!', code: HttpStatus.NO_CONTENT })
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/checkin_q', async (req: Request, res: Response) => {
    let id = req.body.data.id;
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        if (req.decoded.line_userId) {
            let ck: any = await lineliffModel.checkLiffFirst(req.db, req.decoded.line_userId)
            if (ck[0].member_status_level == 'admin' || ck[0].member_status_level == 'superAdmin') {
                const dataraw = {
                    id: id,
                    // userId: req.decoded.line_userId,
                    datetime: datetime,
                    // approved_member_id: ck[0].member_id
                }
                console.log(dataraw);
                await managerModel.updatecheckInQ(req.db, dataraw)
                res.send({ ok: true, code: HttpStatus.OK });
            } else {
                res.send({ ok: false, code: HttpStatus.UNAUTHORIZED });
            }
        } else {
            res.send({ ok: false, message: 'NO userID!!!!!', code: HttpStatus.NO_CONTENT })
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.get('/masseuse', async (req: Request, res: Response) => {
    try {
        const rs = await managerModel.getMasseusePerson(req.db);
        // console.log(rs);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK })
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

router.post('/masseuse', upload.single('avatar'), async (req: Request, res: Response) => {
    const fullname = req.body.fullname;
    const nickname = req.body.nickname;
    const service_planthai_id = req.body.service_planthai_id;
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        const url = req.protocol + '://' + req.get('host') + '/upload/avatar/';

        const data = {
            masseuse_full_name: fullname,
            masseuse_nick_name: nickname,
            masseuse_img: url + upliadFileData.filename,
            ref_service_planthai: service_planthai_id,
            masseuse_insert_datetime: datetime,
            ref_member_fullname: req.decoded.member_fullname,
            ref_datetime: datetime
        }
        // console.log('upliadFileData', upliadFileData);
        // console.log(data);
        if (upliadFileData.status) {
            const rs = await managerModel.saveMasseuse(req.db, data)
            console.log(rs);
            res.send({ ok: true, code: HttpStatus.OK })
        } else {
            res.send({ ok: false, message: 'เลือกไฟล์ไม่ถูกต้อง รองรับเฉาะ [ .jpg | .jpeg |.png ]', code: HttpStatus.NO_CONTENT })
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});

// กำลังพัตนา
router.put('/masseuse/:id', upload.single('avatar'), async (req: Request, res: Response) => {
    const id = req.params.id;
    const fullname = req.body.fullname;
    const nickname = req.body.nickname;
    const service_planthai_id = req.body.service_planthai_id;
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        const url = req.protocol + '://' + req.get('host') + '/upload/avatar/';
        console.log(upliadFileData);
        // console.log(data);

        if (upliadFileData.nofile === false && upliadFileData.status === true) {
            console.log('มีไฟล์+บันทึก save ไฟล์แล้ว');
            const data = {
                masseuse_full_name: fullname,
                masseuse_nick_name: nickname,
                masseuse_img: url + upliadFileData.filename,
                masseuse_update_datetime: datetime,
                ref_service_planthai: service_planthai_id,
                ref_member_fullname: req.decoded.member_fullname,
                ref_datetime: datetime
            }
            await managerModel.updateMasseuse(req.db, id, data)
            // console.log(rs);
            res.send({ ok: true, code: HttpStatus.OK })
        } else if (upliadFileData.nofile === true && upliadFileData.status === false) {
            console.log('ไม่มีไฟล์ใหม่');
            const data = {
                masseuse_full_name: fullname,
                masseuse_nick_name: nickname,
                masseuse_update_datetime: datetime,
                ref_service_planthai: service_planthai_id,
                ref_member_fullname: req.decoded.member_fullname,
                ref_datetime: datetime
            }
            await managerModel.updateMasseuse(req.db, id, data)
            res.send({ ok: true, code: HttpStatus.OK })
        } else {
            res.send({ ok: false, message: 'เลือกไฟล์ไม่ถูกต้อง รองรับเฉาะ [ .jpg | .jpeg |.png ]', code: HttpStatus.NO_CONTENT });
        }
    } catch (error) {
        res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
});


export default router;