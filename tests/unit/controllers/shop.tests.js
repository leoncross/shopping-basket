const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai').use(sinonChai);

const { expect } = chai;

const shop = require('../../../controllers/shop');

describe('Shop controller', () => {
  let res;
  let req;

  beforeEach(() => {
    req = {};
    res = {};

    res.json = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);
  });

  describe('#buy', () => {

    it('returns in json whatever is passed to the request body', () => {
      req.body = {
        items: ['apple', 'apple', 'milk'],
        currency: 'EUR',
      };

      shop.buy(req, res);

      expect(res.json).calledOnceWith(req.body);
    });
  });
});
