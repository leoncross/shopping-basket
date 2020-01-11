const chai = require('chai');
const nock = require('nock');

const { expect } = chai;

const shop = require('../../../models/shop');
const { getUrl, usdResponse, gbpResponse } = require('../../helpers');

describe('Shop Model', () => {
  const mockCurrencyRequest = (currency, response) => {
    const url = getUrl(currency);
    return nock('http://apilayer.net')
      .get(url)
      .reply(200, response);
  };

  let items;
  let currency;
  let order;
  let scope;

  afterEach(() => {
    nock.cleanAll();
  });

  describe('#buy', () => {
    it('returns an object with expected keys', async () => {
      items = ['apple', 'milk'];
      currency = 'USD';

      scope = mockCurrencyRequest(currency, usdResponse);

      order = await shop.buy(items, currency);

      expect(order).to.have.deep.property('subtotal');
      expect(order).to.have.deep.property('discounts');
      expect(order).to.have.deep.property('discountAmt');
      expect(order).to.have.deep.property('total');
      expect(order).to.have.deep.property('currency');
      expect(scope.isDone());
    });
    context('item handling', () => {
      it('iterates through items against catalog and updates order details', async () => {
        items = ['bread'];
        currency = 'USD';

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(items, currency);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 0.8,
          discountAmt: 0,
          discounts: [],
          bread: { count: 1, price: 0.8 },
          total: 0,
          currency: 'USD',
        });
      });
      it('handles multiple of the same item without duplicating object', async () => {
        items = ['soup', 'soup'];
        currency = 'USD';

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(items, currency);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 1.3,
          discountAmt: 0,
          discounts: [],
          soup: { count: 2, price: 1.3 },
          total: 0,
          currency: 'USD',
        });
      });
    });

    context('discount handling', () => {
      it('applies discounts if item has offer', async () => {
        items = ['milk', 'milk', 'milk'];
        currency = 'USD';

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(items, currency);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 3.4499999999999997,
          discountAmt: 0.5,
          discounts: ['buy 3 milks, get 50c off'],
          milk: { count: 3, price: 3.4499999999999997 },
          total: 0,
          currency: 'USD',
        });
      });
      it('does not apply discounts if item has no offer', async () => {
        items = ['soup'];
        currency = 'USD';

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(items, currency);

        expect(order).to.deep.equal({
          subtotal: 0.65,
          discountAmt: 0,
          discounts: [],
          soup: { count: 1, price: 0.65 },
          total: 0,
          currency: 'USD',
        });
        expect(scope.isDone());
      });
    });
    context('currency conversion handling', () => {
      it('applies currency conversion on order', async () => {
        items = ['milk', 'milk', 'milk'];
        currency = 'GBP';

        scope = mockCurrencyRequest(currency, gbpResponse);

        order = await shop.buy(items, currency);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 2.6434417499999996,
          discountAmt: 0.3831075,
          discounts: ['buy 3 milks, get 50c off'],
          milk: { count: 3, price: 3.4499999999999997 },
          total: 0,
          currency: 'GBP',
        });
      });
    });
  });
});
