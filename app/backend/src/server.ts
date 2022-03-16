import { Response, Request } from 'express';
import { App } from './app';
// import Club from './database/models/club';
// import sequelize = require('./database/models/index');
import 'dotenv/config';

const server = new App();

const PORT = process.env.PORT || 3001;

server.app.get('/Login', async (req: Request, res: Response) => {
  res.status(200).json('ok');
});

server.start(PORT);
