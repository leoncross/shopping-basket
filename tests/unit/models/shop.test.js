const chai = require('chai');

const { expect } = chai;

const shop = require('../../../models/shop');

describe('Shop Model', () => {
  describe('#buy', () => {
    it('takes items and currency as arguments and returns args unchanged', () => {
      const items = ['apple', 'milk'];
      const currency = 'GBP';

      expect(shop.buy(items, currency)).to.deep.equal({ items, currency });
    });
  });
});
