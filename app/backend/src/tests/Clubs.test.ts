import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import Club from '../database/models/club';
import { allClubMock } from './mock/db/clubs';

chai.use(chaiHttp);

const { expect } = chai;

describe('Rota GET /Clubs', () => {
  before(async () => {
     sinon.stub(Club, "findAll").resolves(allClubMock as unknown as Club[]);
  });

  after(()=>{
      (Club.findAll as sinon.SinonStub).restore();
  });

  it('Retorna todos clubes', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/Clubs')
    
  expect(chaiHttpResponse).to.have.status(200);
  expect(chaiHttpResponse.body).to.deep.equals(allClubMock);
  });
});

describe('Rota GET /Clubs/:id', () => {
  const clubMock = allClubMock[0];

  before(async () => {
     sinon.stub(Club, "findOne").resolves(clubMock as Club);
  });

  after(()=>{
     (Club.findOne as sinon.SinonStub).restore();
  });

  it('Retorna clube pelo id da rota', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/Clubs/1')
    
  expect(chaiHttpResponse).to.have.status(200);
  expect(chaiHttpResponse.body).to.deep.equals(clubMock);
  });

});

describe('Ao passar id que nao existe', () => {
  before(async () => {
      sinon.stub(Club, "findOne").resolves(null);
  });

  after(()=>{
      (Club.findOne as sinon.SinonStub).restore();
  });


  it('Ao passar id que nao existe, Retorna status 401', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/Clubs/9999')
    
    expect(chaiHttpResponse).to.have.status(401);
  });
})



