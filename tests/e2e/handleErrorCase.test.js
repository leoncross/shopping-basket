const request = require('supertest');

const app = require('../../server/index');

describe('Error e2e', () => {
  context('argument validation', () => {
    it('handles invalid item input', (done) => {
      const items = ['potato'];
      const currency = 'USD';

      const server = app.listen(8080);

      request(server)
        .post('/shop/buy')
        .send({ items, currency })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .expect({
          error: {
            errorMessage: 'item: "potato" is not a valid item',
            errorType: 'BAD_REQUEST',
            httpStatus: 422,
          },
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
    it('handles invalid currency input', (done) => {
      const items = ['apple'];
      const currency = 'example';

      const server = app.listen(8080);

      request(server)
        .post('/shop/buy')
        .send({ items, currency })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .expect({
          error: {
            errorMessage: 'currency: "example" is not an accepted currency',
            errorType: 'BAD_REQUEST',
            httpStatus: 422,
          },
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
    it('handles no item input', (done) => {
      const server = app.listen(8080);

      request(server)
        .post('/shop/buy')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .expect({
          error: {
            errorMessage: 'no items provided in request',
            errorType: 'BAD_REQUEST',
            httpStatus: 422,
          },
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
    it('handles no currency input', (done) => {
      const server = app.listen(8080);
      const items = ['apple'];

      request(server)
        .post('/shop/buy')
        .send({ items })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .expect({
          error: {
            errorMessage: 'no currency provided in request',
            errorType: 'BAD_REQUEST',
            httpStatus: 422,
          },
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
}).timeout(7000);
