const request = require('supertest');

const app = require('../../src/app');

const email = `${Date.now()}@test.com`;

test('Deve listar todos os usuarios', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      
    });
});

test('deve inserir usuario com sucesso', () => {
  
  return request(app).post('/users')
    .send({name: 'Vicente Carvalho', email, password: "123456"})
    .then((res)=> {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Vicente Carvalho');
    })
});

test('Não deve inserier usuário sem nome.', ()=> {
  return request(app).post('/users')
    .send({ email: 'vicente@test.com', password: "123456"})
    .then((res)=> {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    })
});

test('Não deve inserir usuario sem email', async () => {
  const result = await request(app).post('/users')
    .send({name: "Vicente", password: "123456"});
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app).post('/users')
    .send({name: 'Vicente Carvalho', email: 'vicente@test.com',})
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    }).catch(err => done.fail(err));
});

test('Não deve inserie usuario com email existente', ()=> {
  return request(app).post('/users')
  .send({name: 'Vicente Carvalho', email, password: "123456"})
  .then((res)=> {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Já existe um usuario com esse email');
  })
})