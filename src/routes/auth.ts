/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { NextFunction } from 'connect';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
import { LineLiffModel } from '../models/line_liff_model';
const jwt = new Jwt();
const lineliffModel = new LineLiffModel();
const router: Router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    let data = req.body.data;
    let lineUserId = data.line_userId;
    if (lineUserId) {
        try {
            var data_insert = {
                member_line_userId: lineUserId,
                member_fullname: data.fullname,
                member_img: data.img,
                member_birthday: data.birthday,
                member_tel: data.tel,
                member_date_create: moment().format('YYYY-MM-DD HH:mm:ss'),
                member_congenitaldisease: data.congenitaldisease,
                member_gender: data.member_gender
            };

            var rs: any = await lineliffModel.saveMember(req.db, data_insert);
            res.send({ ok: true, message: rs, code: HttpStatus.OK });

        } catch (error) {
            res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
        }
    } else {
        res.send({ ok: false, message: 'ข้อมูลไม่ครบ', code: HttpStatus.UNAUTHORIZED })
    }

});

router.post('/checkliff_first', async (req: Request, res: Response, next: NextFunction) => {
    var userId = req.body.data.user_id;
    // var cid = req.body.cid;
    // var deviceToken = req.body.deviceToken || null;

    if (userId) {
        try {
            var rs: any = await lineliffModel.checkLiffFirst(req.db, userId);
            if (rs.length) {
                // if (deviceToken) {
                //   await userModel.updateDeviceToken(req.db, cid, deviceToken);
                // }
                let payload = {
                    member_id: rs[0].member_id,
                    member_fullname: rs[0].member_fullname,
                    member_img: rs[0].member_img,
                    member_birthday: rs[0].member_birthday,
                    member_tel: rs[0].member_tel,
                    member_congenitaldisease: rs[0].member_congenitaldisease,
                    member_gender: rs[0].member_gender,
                    line_userId: rs[0].member_line_userId,
                    member_status_level: rs[0].member_status_level
                }
                let token = jwt.sign(payload);


                res.send({ ok: true, rows: rs[0], token: token, code: HttpStatus.OK });


            } else {
                res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.NO_CONTENT })
            }
        } catch (error) {
            res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
        }
    } else {
        res.send({ ok: false, message: 'ข้อมูลไม่ครบ:' + userId, code: HttpStatus.UNAUTHORIZED })
    }

});

export default router;