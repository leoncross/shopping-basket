const request = require('supertest');

const app = require('../../server/index');

describe('Success e2e', () => {
  it('provides shopping list of offers with valid currency and gets expected returned object', (done) => {
    const items = ['milk', 'milk', 'milk', 'apple', 'milk', 'milk', 'milk', 'apple'];
    const currency = 'USD';

    const server = app.listen(8080);

    request(server)
      .post('/shop/buy')
      .send({ items, currency })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        currency: 'USD',
        discountAmt: 1.2,
        discounts: [
          'buy 3 milks, get 50c off',
          '10% off apples',
          'buy 3 milks, get 50c off',
          '10% off apples',
        ],
        subtotal: 8.9,
        total: 7.7,
      })
      .end((err) => {
        if (err) {
          server.close();
          return done(err);
        }
        server.close();
        return done();
      });
  });
}).timeout(7000);
