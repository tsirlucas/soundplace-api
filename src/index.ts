import cors from 'cors';
import express from 'express';
import {dataRouter} from 'routes';

const app = express();

app.use(cors());

app.options('*', cors());

app.get('/', (_req, res) => res.send('Working ;)'));

// Routes

app.use('/api', dataRouter);

export default app;
