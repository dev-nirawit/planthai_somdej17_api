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
          customerId : customerId
        }

        // if (deviceToken) {
        //   await userModel.updateDeviceToken(req.db, cid, deviceToken);
        // }

        // var token = await jwt.sign(payload);
        res.send({ ok: true, message: payload ,code: HttpStatus.OK});

      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!',code: HttpStatus.UNAUTHORIZED })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:'+userId,code: HttpStatus.UNAUTHORIZED })
  }

});

// ข้อมูลพื้นฐานลูกค้า
router.get('/profile/:userId', async (req: Request, res: Response, next: NextFunction) => {
  var userId = req.params.userId;

  if (userId) {

    try {
      var rs: any = await lineliffModel.getCustomerProfile(req.db, userId);
      if (rs.length) {
        res.send({ ok: true, rows: rs ,code: HttpStatus.OK});
      } else {
        res.send({ ok: false, message: 'ไม่พบข้อมูลของท่าน!',code: HttpStatus.UNAUTHORIZED })
      }
    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ:'+userId,code: HttpStatus.UNAUTHORIZED })
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
        customer_line_userId : customerLineUserId,
        customer_name : customerName,
        customer_img : customerImg,
        customer_tel : customerTel,
        customer_date_create : moment().format('YYYY-MM-DD HH:mm:ss'),
        customer_age : customerAge,
        customer_weight : customerWeight,
        customer_congenitaldisease : customerCongenitaldisease
      };

      var rs: any = await lineliffModel.saveCustomer(req.db, data);
        res.send({ ok: true, message: rs ,code: HttpStatus.OK});

    } catch (error) {
      res.send({ ok: false, message: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ ok: false, message: 'ข้อมูลไม่ครบ',code: HttpStatus.UNAUTHORIZED })
  }

});

// get STEP 1
router.get('/branch_province', async (req: Request, res: Response) => {
  try {
    var rs: any = await lineliffModel.getBranchProvince(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});

// get STEP 2
router.get('/get_food_store/:provinceId', async (req: Request, res: Response) => {
  try {
    let provinceId = req.params.provinceId;
    var rs: any = await lineliffModel.getFoodStoreRequest(req.db,provinceId);
    // res.send({ ok: true, message: `val : ${provinceId}` });
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});
// get STEP 3
router.get('/food_list_menu/:foodStoreId', async (req: Request, res: Response) => {
  try {
    let foodStoreId = req.params.foodStoreId;
    var rs: any = await lineliffModel.getFoodListMenuRequest(req.db,foodStoreId);
    // res.send({ ok: true, message: `val : ${provinceId}` });
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, message: error.message });
  }
});
export default router;