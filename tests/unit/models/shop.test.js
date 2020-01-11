const chai = require('chai');

const { expect } = chai;

const shop = require('../../../models/shop');

describe('Shop Model', () => {
  describe('#buy', () => {
    it('returns an object with expected keys', () => {
      const items = ['apple', 'milk'];
      const currency = 'GBP';

      const order = shop.buy(items, currency);

      expect(order).to.have.deep.property('subtotal');
      expect(order).to.have.deep.property('discounts');
      expect(order).to.have.deep.property('discountAmt');
      expect(order).to.have.deep.property('total');
      expect(order).to.have.deep.property('currency');
    });
  });
});
