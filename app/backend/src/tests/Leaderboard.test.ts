import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import sequelize from '../database/models';
import { app } from '../app';
import { expectLeaderBoardOne, expectLeaderBoardTwo, mockLeaderBoardAway, mockLeaderBoardHome } from './mock/db/tableLeaderboard';

chai.use(chaiHttp);

const { expect } = chai;


describe('Rota GET /leaderboard/:homeOrAway', () => {

  before(async () => {
    sinon.stub(sequelize, "query")
    .resolves(mockLeaderBoardHome as [ unknown[], unknown]);
  });

  after(()=>{
    (sequelize.query as sinon.SinonStub).restore();
  });



  it('Ao passar o parametro home na rota, retorna leaderboard dos que jogaram em casa.', async () => {
    const chaiResponse = await chai.request(app)
      .get('/leaderboard/home');

    expect(chaiResponse).to.have.status(200);
    expect(chaiResponse.body).to.deep.equals(expectLeaderBoardOne);
  });

  it('Ao passar o parametro waway na rota, retorna leaderboard dos que jogaram fora de casa.', async () => {
    const chaiResponse = await chai.request(app)
      .get('/leaderboard/away');
    
      expect(chaiResponse).to.have.status(200);
      expect(chaiResponse.body).to.deep.equals(expectLeaderBoardOne);
  });
});

describe.skip('Rota GET /leaderboard', () => {
  it('Retorna o leaderboard geral', async () => {
    const chaiResponse = await chai.request(app)
      .get('/leaderboard');      

    expect(chaiResponse).to.have.status(200);
  });
})