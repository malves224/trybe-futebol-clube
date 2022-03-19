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

describe('Rota POST /matchs, criação de partidas.', () => {

  const partidaForCreate = {
    "homeTeam": 16, // O valor deve ser o id do time
    "awayTeam": 8, // O valor deve ser o id do time
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
    "inProgress": true // a partida deve ser criada como em progresso
  };

  before(async () => {
    // sinon.stub(Match, "findAll").resolves(allMatchFineshed as unknown as Match[]);
  });

  after(()=>{
    // (Match.findAll as sinon.SinonStub).restore();
  });

  it('Sem token valido, retorna status 401 com a menssagem "token invalido"', async () => {
    let chaiHttpResponse = await chai.request(app)
    .post('/matchs?inProgress=false')
    .set('Authorization', 'token Invalido')
    .send(partidaForCreate)

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "token invalido");
  });

  it(`Ao tentar criar com clubs iguais, retorna status 401 com a menssagem devida`, async () => {
    let chaiHttpResponse = await chai.request(app)
    .post('/matchs?inProgress=false')
    .set('Authorization', 'token Invalido')
    .send({...partidaForCreate, awayTeam: 16})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "It is not possible to create a match with two equal teams");
  });

  it(`Ao tentar criar com clube que não existe, retorna status 401 com a menssagem devida`, async () => {
    let chaiHttpResponse = await chai.request(app)
    .post('/matchs?inProgress=false')
    .set('Authorization', 'token Invalido')
    .send({...partidaForCreate, awayTeam: 9999})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "Team not found");
  });

  it(`Ao criar uma partida, retorna status 201 com os dados no corpo da response`, async () => {
    let chaiHttpResponse = await chai.request(app)
    .post('/matchs?inProgress=false')
    .set('Authorization', 'token Invalido')
    .send({...partidaForCreate, awayTeam: 9999})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.deep.equals({id: 1, partidaForCreate})
  });
});