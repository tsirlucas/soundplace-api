import axios from 'axios';
import {environment} from 'config';
import cors from 'cors';
import express from 'express';
import {dataRouter, importationRouter} from 'routes';

const app = express();

app
  .use(cors())
  .options('*', cors())
  .get('/', (_req, res) => res.send('Working ;)'))
  .use(async (req, res, next) => {
    try {
      const {authorization} = req.headers;
      console.log(authorization);
      const {data} = await axios.get(`${environment.settings.authEndpoint}/jwt/verify`, {
        headers: {
          Authorization: authorization || null,
        },
      });

      res.locals.userId = data.userId;
      next();
    } catch (e) {
      console.log(e);
      res.status(e.response.status).send(e.response.data);
    }
  })
  .use('/api', dataRouter)
  .use('/import', importationRouter);

export default app;
