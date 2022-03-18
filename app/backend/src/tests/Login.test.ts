import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import User from '../database/models/user';

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import { adminUserMock } from './mock/db/user';

chai.use(chaiHttp);

const { expect } = chai;

const expectValue = {
  id: 1,
  username: "Admin",
  role: "admin",
  email: "admin@admin.com"
}

describe('Rota POST /Login', () => {
   before(async () => {
     sinon.stub(User, "findOne").resolves(adminUserMock as User);
   });

   after(()=>{
      (User.findOne as sinon.SinonStub).restore();
   })


   it('Ao passar sem a chave email, Retorna status 401 com a menssagem "All fields must be filled"', async () => {
     let chaiHttpResponse = await chai.request(app)
        .post('/Login')
        .send({"password": "123456"});
        
     expect(chaiHttpResponse).to.have.status(401);
     expect(chaiHttpResponse.body).to.have.property("message", "All fields must be filled");
   });

   it('Ao passar sem a chave password, Retorna status 401 com a menssagem "All fields must be filled"', async () => {
    let chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "teste@test.com"})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "All fields must be filled");
  });

  it('Ao passar um email invalido, Retorna status 401 com a menssagem "Incorrect email or password"', async () => {
    let chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "admi", "password": "123456"});       

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "Incorrect email or password");
  });

  it('Ao passar um senha invalido, Retorna status 401 com a menssagem "Incorrect email or password"', async () => {
    let chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "admin@admin.com", "password": "aaaa"})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property("message", "Incorrect email or password");
  });

  it('Ao passar login correto, Retorna status 200 com os dados do usuario no corpo da response', async () => {
    let chaiHttpResponse = await chai.request(app).post('/Login')
       .send({"email": "admin@admin.com", "password": "secret_admin"})       

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.have.property('user');
    expect(chaiHttpResponse.body).to.have.property('token');
    expect(chaiHttpResponse.body.user).to.deep.equals(expectValue)
  });

  describe('Rota GET /Login/validate ', () => {
    it('Ao passar um token invalido no header, retorna status 401.', async () => {
      let chaiHttpResponse = await chai.request(app)
      .get('/Login/validate')
      .set({"Authorization": "token invalido"});
        
      expect(chaiHttpResponse).to.have.status(401);
    });

    it('Ao passar um token valido no header, retorna status 200 com a role do usuario no body da response.', async () => {
      let {body: { token }} = await chai.request(app).post('/Login')
      .send({"email": "admin@admin.com", "password": "secret_admin"})       


      let chaiHttpResponse = await chai.request(app)
      .get('/Login/validate')
      .set({"Authorization": token});
        
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.deep.equals("admin");
    });
  })
});
