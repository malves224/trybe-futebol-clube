import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import Match from '../database/models/match';
import { allMatchFineshed, allMatchInProgress, allMatchWithClubs } from './mock/db/matchs';
import User from '../database/models/user';
import { adminUserMock } from './mock/db/user';

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

describe('Rota POST /matchs, tentativa de criação de partidas.', () => {

  const partidaForCreate = {
    "homeTeam": 16, // O valor deve ser o id do time
    "awayTeam": 8, // O valor deve ser o id do time
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
    "inProgress": true // a partida deve ser criada como em progresso
  };


  describe('Em cassos de BAD Request', () => {

    before(async () => {
      sinon.stub(User, "findOne").resolves(adminUserMock as User);
      sinon.stub(Match, "findOne").resolves(null);
    });
  
    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
      (Match.findOne as sinon.SinonStub).restore();
    });
  
    it('Sem token valido, retorna status 401 com a menssagem "jwt malformed"', async () => {
      let chaiHttpResponse = await chai.request(app)
      .post('/matchs')
      .set('Authorization', 'jwt malformed')
      .send(partidaForCreate)
  
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body).to.have.property("message", "jwt malformed");
    });
  
    it(`Ao tentar criar com clubs iguais, retorna status 401 com a menssagem devida`, async () => {
      const { body: { token } } = await chai.request(app)
      .post('/Login')
      .send({"email": "admin@admin.com", "password": "secret_admin"});
  
      const chaiHttpResponse = await chai.request(app)
      .post('/matchs')
      .set('authorization', token)
      .send({...partidaForCreate, awayTeam: 16});    
  
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body).to.have.property("message", "It is not possible to create a match with two equal teams");
    });
  
    it(`Ao tentar criar com clube que não existe, retorna status 401 com a menssagem devida`, async () => {
      const { body: { token } } = await chai.request(app)
      .post('/Login')
      .send({"email": "admin@admin.com", "password": "secret_admin"});
  
      let chaiHttpResponse = await chai.request(app)
      .post('/matchs')
      .set('authorization', token)
      .send({...partidaForCreate, awayTeam: 9999});
  
      expect(chaiHttpResponse).to.have.status(401);
      expect(chaiHttpResponse.body).to.have.property("message", "There is no team with such id!");
    });
  })


  describe('Em casso de sucesso', () => {

    before(async () => {
      sinon.stub(User, "findOne").resolves(adminUserMock as User);
      sinon.stub(Match, "findOne").resolves({ id: 1 } as Match);
      sinon.stub(Match, "create").resolves({id: 1, ...partidaForCreate} as unknown as Match)
    });
  
    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
      (Match.findOne as sinon.SinonStub).restore();
      (Match.create as sinon.SinonStub).restore();
    });
  
  
    it(`Ao criar uma partida, retorna status 201 com os dados no corpo da response`, async () => {
      const { body: { token } } = await chai.request(app)
      .post('/Login')
      .send({"email": "admin@admin.com", "password": "secret_admin"});
  
  
      let chaiHttpResponse = await chai.request(app)
      .post('/matchs')
      .set('authorization', token)
      .send(partidaForCreate);
  
      expect(chaiHttpResponse).to.have.status(201);
      expect(chaiHttpResponse.body).to.deep.equals({id: 1, ...partidaForCreate})
    });
  });
});

describe('Patch /matchs/:id/finish fineRota de finalizaçao de partida', () => {

  before(async () => {
    sinon.stub(Match, "update").resolves();
  });

  after(()=>{
    (Match.update as sinon.SinonStub).restore();
  });


  it('Retorna status 200, ao finalziar uma partida', async () => {
    let chaiHttpResponse = await chai.request(app)
    .patch('/matchs/50/finish');

    expect(chaiHttpResponse).to.have.status(200);
  });
});

describe('Patch /matchs/:id, que muda o placar de uma partida', () => {
  before(async () => {
    // sinon.stub(Match, "update").resolves();
  });

  after(()=>{
    // Match.update as sinon.SinonStub).restore();
  });


  it('Retorna status 200, ao editar o placar', async () => {
    let chaiHttpResponse = await chai.request(app)
    .patch('/matchs/48')
    .send({
      "homeTeamGoals": 10,
      "awayTeamGoals": 0
    })

    expect(chaiHttpResponse).to.have.status(200);
  });
});