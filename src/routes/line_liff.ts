/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { NextFunction } from 'connect';
import * as express from 'express';
import { Router, Request, Response } from 'express';

import { LineLiffModel } from '../models/line_liff_model';

const lineliffModel = new LineLiffModel();
const router: Router = Router();

// const gcm = require('node-gcm');

// #localhost:3000/api/line_liff/
router.get('/', async (req: Request, res: Response) => {
  try {
    res.send({ ok: true, message: 'Welcome to RESTful api server in Fontend Liff!', code: HttpStatus.OK });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

router.get('/selectbooking_limit', async (req: Request, res: Response) => {
  try {
    var rs: any = await lineliffModel.getselectbooking_limit(req.db);
    res.send({ ok: true, message: rs, code: HttpStatus.OK });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});


router.post('/checkliff_first', async (req: Request, res: Response, next: NextFunction) => {
  var userId = req.body.user_id;
  // var cid = req.body.cid;
  // var deviceToken = req.body.deviceToken || null;

  if (userId) {
    try {
      var rs: any = await lineliffModel.checkLiffFirst(req.db, userId);
      if (rs.length) {
        var customerId = rs[0].customer_id;

        var payload = {
          customerId: customerId
        }

        // if (deviceToken) {
        //   await userModel.updateDeviceToken(req.db, cid, deviceToken);
        // }

        // var token = await jwt.sign(payload);
        res.send({ ok: true, message: payload, code: HttpStatus.OK });

      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.UNAUTHORIZED })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:' + userId, code: HttpStatus.UNAUTHORIZED })
  }

});

// ข้อมูลพื้นฐานลูกค้า
router.get('/profile/:userId', async (req: Request, res: Response, next: NextFunction) => {
  var userId = req.params.userId;

  if (userId) {

    try {
      var rs: any = await lineliffModel.getCustomerProfile(req.db, userId);
      if (rs.length) {
        res.send({ ok: true, rows: rs, code: HttpStatus.OK });
      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!', code: HttpStatus.UNAUTHORIZED })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:' + userId, code: HttpStatus.UNAUTHORIZED })
  }

});

router.post('/save_customer', async (req: Request, res: Response, next: NextFunction) => {
  let customerName = req.body.customerName;
  let customerImg = req.body.customerImg;
  let customerTel = req.body.customerTel;
  let customerLineUserId = req.body.customerLineUserId;
  let customerAge = req.body.customerAge;
  let customerWeight = req.body.customerWeight;
  let customerCongenitaldisease = req.body.customerCongenitaldisease;
  if (customerLineUserId) {
    try {
      var data = {
        customer_line_userId: customerLineUserId,
        customer_name: customerName,
        customer_img: customerImg,
        customer_tel: customerTel,
        customer_date_create: moment().format('YYYY-MM-DD HH:mm:ss'),
        customer_age: customerAge,
        customer_weight: customerWeight,
        customer_congenitaldisease: customerCongenitaldisease
      };

      var rs: any = await lineliffModel.saveCustomer(req.db, data);
      res.send({ ok: true, message: rs, code: HttpStatus.OK });

    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ', code: HttpStatus.UNAUTHORIZED })
  }

});

router.post('/save_customer_booking', async (req: Request, res: Response, next: NextFunction) => {
  let data = req.body.data;
  let datetime_create = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    // rs : any = await.
    let payload = {
      'inorder_booking_custometype': data.bookingType,
      'inorder_booking_fullname': data.customerName,
      'inorder_booking_age': data.customerAge,
      'inorder_booking_weight': data.customerWeight,
      'inorder_booking_congenitaldisease': data.customerCongenitaldisease,
      'inorder_booking_tel': data.customerTel,
      'inorder_booking_selectdate': data.myHiddenInputBookingDate,
      'inorder_booking_ref_id': data.customerAge,
      'inorder_booking_img_other': '',
      'inorder_booking_create_datetime': datetime_create
    };
    if (data.bookingType == 2) {
      payload.inorder_booking_img_other = data.inorder_booking_img_other;
    }
    let rs: any = await lineliffModel.saveOrder(req.db, payload);
    if (rs.length) {
      console.log(rs);
      res.send({ ok: true, status: true, payload: rs[0], code: HttpStatus.OK });
    } else {
      let message_error = {
        type: 'error',
        title: 'เนื่องจากระบบยังไม่ได้เปิดให้บันทึก',
        text: 'กรุณาแจ้ง ผู้ดูแลระบบ เนื่องจากเกิดข้อผิดพลาด',
        showConfirmButton: true,
        confirmButtonText: 'รับทราบ'
      };
      res.send({ ok: true, status: false, message_error: message_error, code: HttpStatus.OK });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

// get 
router.get('/getbooking_time/:selectdate', async (req: Request, res: Response) => {
  let selectdate = req.params.selectdate;
  try {
    var rs: any = await lineliffModel.getbookingTimeSql(req.db, selectdate);
    res.send({ ok: true, rows: rs[0] });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

export default router;