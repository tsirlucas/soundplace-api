import cors from 'cors';
import express from 'express';
import {dataRouter, subscriptionRouter} from 'routes';

const app = express();

app.use(cors());

app.options('*', cors());

app.get('/', (_req, res) => res.send('Working ;)'));

// Routes

app.use('/api', dataRouter);
app.use('/subscription', subscriptionRouter);

export default app;
