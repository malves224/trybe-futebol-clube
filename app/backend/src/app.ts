import bodyParser = require('body-parser');
import * as express from 'express';
import Club from './Controller/Club';
import userController from './Controller/User';
import Match from './Controller/Match';
import MiddlewareAuth from './auth/MiddlewareAuth';

class App {
  public app: express.Express;

  // private User: User;
  // ...

  constructor() {
    // ...
    this.app = express();
    this.config();
    this.app.post('/Login', userController.loginUser);
    this.app.get('/Login/validate', userController.validate);
    this.app.get('/Clubs', Club.getAll);
    this.app.get('/Clubs/:id', Club.getOne);
    this.app.patch('/matchs/:id/finish', Match.finish);
    this.app.patch('/matchs/:id', Match.editScoreboard);
    this.app.get('/matchs', Match.getAll);
    this.app.post('/matchs', MiddlewareAuth.authToken, Match.create);
    this.app.get('/leaderboard/:homeOrAway', Match.leaderboard);
    this.app.get('/leaderboard/', Match.leaderboard);
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');

      next();
    };

    this.app.use([accessControl, bodyParser.json()]);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`app rodando ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
