import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import Match from '../database/models/match';
import { allMatchFineshed, allMatchInProgress, allMatchWithClubs } from './mock/db/matchs';

chai.use(chaiHttp);

const { expect } = chai;

describe('Rota GET  /matchs', () => {

  before(async () => {
    sinon.stub(Match, "findAll").resolves(allMatchWithClubs as unknown as Match[]);
  });

  after(()=>{
    (Match.findAll as sinon.SinonStub).restore();
  });


  it('Retorna todas partidas', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/matchs')
    
    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equals(allMatchWithClubs);
  });
});

describe('Rota GET /matchs?inProgress=true', () => {

  before(async () => {
    sinon.stub(Match, "findAll").resolves(allMatchInProgress as unknown as Match[]);
  });

  after(()=>{
    (Match.findAll as sinon.SinonStub).restore();
  });

  it('Retorna partidas em andamento', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/matchs?inProgress=true')

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equals(allMatchInProgress);
  });

});

describe('Rota GET /matchs?inProgres=false', () => {

  before(async () => {
    sinon.stub(Match, "findAll").resolves(allMatchFineshed as unknown as Match[]);
  });

  after(()=>{
    (Match.findAll as sinon.SinonStub).restore();
  });

  it('Retorna partidas encerradas', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/matchs?inProgress=false')

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equals(allMatchFineshed);
  });
  
});