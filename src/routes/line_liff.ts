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

// const gcm = require('node-gcm');

router.get('/profile', async (req: Request, res: Response) => {
  let lineId = req.decoded.line_userId;
  try {
    let rs: any = await lineliffModel.getUserProfile(req.db, lineId)
    // console.log(rs)
    res.send({ ok: true, rows: rs[0], code: HttpStatus.OK })
  } catch (error) {
    res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

router.put('/profile', async (req: Request, res: Response) => {
  let lineId = req.decoded.line_userId
  let data = req.body.data;
  try {
    let rs: any = await lineliffModel.updateUserProfile(req.db, lineId, data)
    console.log(rs)
    res.send({ ok: true, rows: rs, code: HttpStatus.OK })
  } catch (error) {
    res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

router.get('/service_planthai', async (req: Request, res: Response) => {
  try {
    let rs: any = await lineliffModel.getservice_planthai(req.db);
    let rs_more: any = await lineliffModel.getServicePlanthaiMore(req.db);
    // console.log(rs_more[0].ref_service_planthai_id)
    res.send({ ok: true, rows: rs, rs_more: rs_more, code: HttpStatus.OK });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

router.get('/booking_dateyear_disable', async (req: Request, res: Response) => {
  try {
    let rs: any = await lineliffModel.getHolidayInYear(req.db);
    console.log(rs.length)
    res.send({ ok: true, rows: rs, code: HttpStatus.OK });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

router.get('/selectbooking_limit/:service_planthai_id/:date', async (req: Request, res: Response) => {
  var service_planthai_id = req.params.service_planthai_id;
  var date = req.params.date;
  try {

    var rs: any = await lineliffModel.getbooking_rangetime(req.db, service_planthai_id, date);
    res.send({ ok: true, rows: rs[0], code: HttpStatus.OK });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});


router.post('/save_booking', async (req: Request, res: Response, next: NextFunction) => {
  let data = req.body.data;
  let line_userId = req.decoded.line_userId
  let datetime_create = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    let getUser: any = await lineliffModel.getUserProfile(req.db, line_userId)
    if (getUser.length == 1) {
      const member_id = getUser[0].member_id

      let checkInOrder: any = await lineliffModel.checkUserInorderDuplicate(req.db, member_id, data.booking_date, data.service_planthai_id)
      console.log('checkInOrder', checkInOrder.length)
      if (checkInOrder.length == 0) {
        let payload = {
          'inorder_booking_date': data.booking_date,
          'inorder_booking_create_datetime': datetime_create,
          'ref_member_id': member_id,
          'ref_booking_limit_id': data.booking_limit_id,
          'ref_service_planthai_id': data.service_planthai_id
        };

        let rs: any = await lineliffModel.saveInOrerOrder(req.db, payload);
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, message: 'วันนี้จองคิวของรายการนี้แล้ว!', code: HttpStatus.MULTIPLE_CHOICES });
      }
    } else {
      res.send({ ok: false, message: 'ไม่พบการลงทะเบียน!', code: HttpStatus.BAD_REQUEST });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

router.get('/get_inorderbooking', async (req: Request, res: Response) => {
  var lineUserId = req.decoded.line_userId

  if (lineUserId) {
    try {
      let rs: any = await lineliffModel.getOrderBooking(req.db, lineUserId);
      if (rs.length) {
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.OK })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:', code: HttpStatus.UNAUTHORIZED })
  }
});

router.get('/get_inorderbooking_history', async (req: Request, res: Response) => {
  var lineUserId = req.decoded.line_userId

  if (lineUserId) {
    try {
      let rs: any = await lineliffModel.getOrderBookingHistory(req.db, lineUserId);
      if (rs.length) {
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.OK })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:', code: HttpStatus.UNAUTHORIZED })
  }
});

export default router;