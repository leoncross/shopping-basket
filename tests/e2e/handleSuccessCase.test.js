const request = require('supertest');
const fetch = require('node-fetch');

const app = require('../../server/index');

describe('Success e2e', () => {
  context('large order in USD', () => {
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
  });

  context('handling currency conversion', () => {
    let convertedDiscountAmt;
    let total;
    let subtotal;
    let currencyRate;

    beforeEach((done) => {
      const url = `http://apilayer.net/api/live?access_key=${process.env.API_KEY}&currencies=EUR&format=1`;

      fetch(url)
        .then(data => data.json())
        .then((data) => {
          currencyRate = data.quotes.USDEUR;
          done();
        });
    });

    it('correctly handles currency conversion of items', (done) => {
      const items = ['soup', 'bread', 'milk', 'apple', 'bread', 'milk', 'soup', 'apple'];
      const currency = 'EUR';
      const server = app.listen(8080);

      convertedDiscountAmt = +(0.2 * currencyRate).toFixed(2);
      subtotal = +(7.2 * currencyRate).toFixed(2);
      total = +(7 * currencyRate).toFixed(2);

      request(server)
        .post('/shop/buy')
        .send({ items, currency })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          currency: 'EUR',
          discountAmt: convertedDiscountAmt,
          discounts: ['10% off apples', '10% off apples'],
          subtotal,
          total,
        })
        .end((err) => {
          if (err) {
            server.close();
            done(err);
          }
          server.close();
          done();
        });
    });
  });
}).timeout(7000);
