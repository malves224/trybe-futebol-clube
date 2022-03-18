import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import Club from '../database/models/club';
import { allClubMock } from './mock/db/clubs';

chai.use(chaiHttp);

const { expect } = chai;

describe.only('Rota GET /Clubs', () => {
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
  before(async () => {
    // sinon.stub(Clubs, "findOne").resolves(clubFromIdMock as Clubs);
  });

  after(()=>{
     // (User.findOne as sinon.SinonStub).restore();
  });

  it('Retorna clube pelo id da rota', async () => {
    let chaiHttpResponse = await chai.request(app)
    .get('/Clubs')
    
  expect(chaiHttpResponse).to.have.status(200);
  // expect(chaiHttpResponse.body).to.have.property(clubFromIdMock);
  });
});

