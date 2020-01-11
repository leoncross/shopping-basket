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
    context('item handling', () => {
      it('iterates through items against catalog and updates order details', () => {
        const items = ['apple', 'soup', 'milk'];
        const currency = 'GBP';

        const order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 2.8,
          discountAmt: 0,
          discounts: [],
          apple: { count: 1, price: 1 },
          milk: { count: 1, price: 1.15 },
          soup: { count: 1, price: 0.65 },
          total: 0,
          currency: 'GBP',
        });
      });
      it('handles multiple of the same item without duplicating object', () => {
        const items = ['apple', 'apple', 'soup', 'milk'];
        const currency = 'GBP';

        const order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 3.8,
          discountAmt: 0,
          discounts: [],
          apple: { count: 2, price: 2 },
          milk: { count: 1, price: 1.15 },
          soup: { count: 1, price: 0.65 },
          total: 0,
          currency: 'GBP',
        });
      });
    });
  });
});
