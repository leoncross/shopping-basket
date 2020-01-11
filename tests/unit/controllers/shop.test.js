const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai').use(sinonChai);

const { expect } = chai;

const shop = require('../../../controllers/shop');
const shopModel = require('../../../models/shop/shop');

describe('Shop controller', () => {
  let res;
  let req;

  let items;
  let currency;
  let order;

  let shopModelBuyStub;

  beforeEach(() => {
    req = {};
    res = {};

    res.json = sinon.stub().returns(res);
    res.status = sinon.stub().returns(res);

    shopModelBuyStub = sinon.stub(shopModel, 'buy');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#buy', () => {
    it('calls buy on shopModel', () => {
      items = ['apple', 'milk'];
      currency = 'GBP';

      req.body = {
        items,
        currency,
      };

      shop.buy(req, res);

      expect(shopModelBuyStub).calledOnceWith(items, currency);
    });
    it('passes back returned object from shopModel', async () => {
      items = ['bread'];
      currency = 'USD';

      order = {
        subtotal: 0.8,
        discountAmt: 0,
        discounts: [],
        total: 0.8,
        currency: 'USD',
      };

      req.body = {
        items,
        currency,
      };

      shopModelBuyStub.returns(order);

      await shop.buy(req, res);

      expect(res.json).calledOnceWith(order);
    });
  });
});
