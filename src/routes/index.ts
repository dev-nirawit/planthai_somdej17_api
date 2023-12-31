import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';

import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

// router.get('/test-mqtt', (req: Request, res: Response) => {
//   req.mqttClient.publish('request/notify', 'new request', { qos: 0, retain: false });
//   res.send({ ok: true });
// });

router.get('/gen-token', async (req: Request, res: Response) => {

  try {
    let payload = {
      fullname: 'Nirawit Kamma',
      username: 'do',
      id: 1
    }

    let token = jwt.sign(payload);
    res.send({ ok: true, token: token, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

export default router;