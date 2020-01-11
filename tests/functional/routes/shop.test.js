const request = require('supertest');
const nock = require('nock');

const app = require('../../../server/index');
const { mockCurrencyRequest, eurResponse } = require('../../helpers');

describe('Routes', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('with valid params returns 200 and order object', (done) => {
    const items = ['apple', 'soup', 'bread', 'milk'];
    const currency = 'EUR';

    mockCurrencyRequest(currency, eurResponse);

    const server = app.listen(8080);

    request(server)
      .post('/shop/buy')
      .send({ items, currency })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        currency: 'EUR',
        discountAmt: 0.09,
        discounts: ['10% off apples'],
        subtotal: 3.24,
        total: 3.15,
      })
      .end((err) => {
        server.close();
        done(err);
      });
  });
  it('with invalid params returns 200 and an error object', (done) => {
    const items = ['pear', 'potato'];
    const currency = 'EUR';

    mockCurrencyRequest(currency, eurResponse);

    const server = app.listen(8080);

    request(server)
      .post('/shop/buy')
      .send({ items, currency })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        error: {
          errorMessage: 'invalid argument provided',
          errorType: 'BAD_REQUEST',
        },
      })
      .end((err) => {
        server.close();
        done(err);
      });
  });
});
