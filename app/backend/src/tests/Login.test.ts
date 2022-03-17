import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;



describe('Rota POST /Login', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  let chaiHttpResponse: Response;

   before(async () => {
     // sinon.stub(Example, "findOne").resolves();
   });

   after(()=>{
     // (Example.findOne as sinon.SinonStub).restore();
   })


   it('Ao passar sem a chave email, Retorna status 401 com a menssagem "All fields must be filled"', async () => {
     chaiHttpResponse = await chai.request(app)
        .post('/Login')
        .send({"password": "123456"})

     expect(chaiHttpResponse).to.have.status(401);
     expect(chaiHttpResponse).to.have.property("message", "All fields must be filled");
   });

   it('Ao passar sem a chave password, Retorna status 401 com a menssagem "All fields must be filled"', async () => {
    chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "teste@test.com"})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse).to.have.property("message", "All fields must be filled");
  });

  it('Ao passar um email invalido, Retorna status 401 com a menssagem "Incorrect email or password"', async () => {
    chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "teste@test.com", "password": "123456"})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse).to.have.property("message", "Incorrect email or password");
  });

  it('Ao passar um senha invalido, Retorna status 401 com a menssagem "Incorrect email or password"', async () => {
    chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "admin@admin.com", "password": "123456"})

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse).to.have.property("message", "Incorrect email or password");
  });

  it('Ao passar login correto, Retorna status 200 com os dados do usuario no corpo da response', async () => {
    chaiHttpResponse = await chai.request(app)
       .post('/Login')
       .send({"email": "admin@admin.com", "password": "senha correta"})

    expect(chaiHttpResponse).to.have.status(200);
    // expect(chaiHttpResponse.body).to.deep.equals(valorEsperado)
  });
});
