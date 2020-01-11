const chai = require('chai');

const { expect } = chai;

const shop = require('../../../models/shop');

describe('Shop Model', () => {
  let items;
  let currency;
  let order;

  describe('#buy', () => {
    it('returns an object with expected keys', () => {
      items = ['apple', 'milk'];
      currency = 'GBP';

      order = shop.buy(items, currency);

      expect(order).to.have.deep.property('subtotal');
      expect(order).to.have.deep.property('discounts');
      expect(order).to.have.deep.property('discountAmt');
      expect(order).to.have.deep.property('total');
      expect(order).to.have.deep.property('currency');
    });
    context('item handling', () => {
      it('iterates through items against catalog and updates order details', () => {
        items = ['bread'];
        currency = 'GBP';

        order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 0.8,
          discountAmt: 0,
          discounts: [],
          bread: { count: 1, price: 0.8 },
          total: 0,
          currency: 'GBP',
        });
      });
      it('handles multiple of the same item without duplicating object', () => {
        items = ['soup', 'soup'];
        currency = 'GBP';

        order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 1.3,
          discountAmt: 0,
          discounts: [],
          soup: { count: 2, price: 1.3 },
          total: 0,
          currency: 'GBP',
        });
      });
    });

    context('discount handling', () => {
      it('applies discounts if item has offer', () => {
        items = ['milk', 'milk', 'milk'];
        currency = 'GBP';

        order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 3.4499999999999997,
          discountAmt: 0.5,
          discounts: ['buy 3 milks, get 50c off'],
          milk: { count: 3, price: 3.4499999999999997 },
          total: 0,
          currency: 'GBP',
        });
      });
      it('does not apply discounts if item has no offer', () => {
        items = ['soup'];
        currency = 'GBP';

        order = shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 0.65,
          discountAmt: 0,
          discounts: [],
          soup: { count: 1, price: 0.65 },
          total: 0,
          currency: 'GBP',
        });
      });
    });
  });
});
