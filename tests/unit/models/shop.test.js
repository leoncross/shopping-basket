const chai = require('chai');

const { expect } = chai;

const shop = require('../../../models/shop');

describe('Shop Model', () => {
  const order = {
    subtotal: 0,
    discounts: [],
    discountAmt: 0,
    total: 0,
    currency: 0,
  };

  describe('#buy', () => {
    it('takes items and currency as arguments and returns args unchanged', () => {
      const items = ['apple', 'milk'];
      const currency = 'GBP';

      expect(shop.buy(items, currency)).to.deep.equal(order);
    });
  });
});
