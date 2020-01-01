import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { CustomerModel } from '../models/customer_model';

const customerModel = new CustomerModel();
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
  });

router.get('/:shop/:meter', (req: Request, res: Response) => {
    var shop = req.params.shop;
    var meter = req.params.meter;
    try {
        if(shop>1){
            
            var sumPrice = (meter*7+8)+((shop-1)*5);
        }else{
             sumPrice = (meter*7+8)+0;
        }
        res.send({ ok: true, message: `Welcome to RESTful api server! รวม: ${sumPrice}`, code: HttpStatus.OK });
    }catch (error){
        res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  });
  export default router;