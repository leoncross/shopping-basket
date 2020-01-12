const chai = require('chai');
const nock = require('nock');

const { expect } = chai;

const shop = require('../../../models/shop/shop');
const { mockCurrencyRequest, usdResponse, gbpResponse } = require('../../helpers');

describe('Shop model', () => {
  let items;
  let currency;
  let order;
  let scope;
  let args;

  afterEach(() => {
    nock.cleanAll();
  });

  describe('#buy', () => {
    it('returns an object with expected keys', async () => {
      items = ['apple', 'milk'];
      currency = 'USD';
      args = { items, currency };
      scope = mockCurrencyRequest(currency, usdResponse);

      order = await shop.buy(args);

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
        args = { items, currency };

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(args);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 0.8,
          discountAmt: 0,
          discounts: [],
          total: 0.8,
          currency: 'USD',
        });
      });
      it('handles multiple of the same item without duplicating object', async () => {
        items = ['soup', 'soup'];
        currency = 'USD';
        args = { items, currency };

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(args);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 1.3,
          discountAmt: 0,
          discounts: [],
          total: 1.3,
          currency: 'USD',
        });
      });
    });

    context('discount handling', () => {
      it('applies discounts if item has offer', async () => {
        items = ['milk', 'milk', 'milk'];
        currency = 'USD';
        args = { items, currency };

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(args);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 3.45,
          discountAmt: 0.5,
          discounts: ['buy 3 milks, get 50c off'],
          total: 2.95,
          currency: 'USD',
        });
      });
      it('does not apply discounts if item has no offer', async () => {
        items = ['soup'];
        currency = 'USD';
        args = { items, currency };

        scope = mockCurrencyRequest(currency, usdResponse);

        order = await shop.buy(args);

        expect(order).to.deep.equal({
          subtotal: 0.65,
          discountAmt: 0,
          discounts: [],
          total: 0.65,
          currency: 'USD',
        });
        expect(scope.isDone());
      });
    });
    context('currency conversion handling', () => {
      it('applies currency conversion on order', async () => {
        items = ['milk', 'milk', 'milk'];
        currency = 'GBP';
        args = { items, currency };

        scope = mockCurrencyRequest(currency, gbpResponse);

        order = await shop.buy(args);

        expect(scope.isDone());
        expect(order).to.deep.equal({
          subtotal: 2.64,
          discountAmt: 0.38,
          discounts: ['buy 3 milks, get 50c off'],
          total: 2.26,
          currency: 'GBP',
        });
      });
    });
    context('argument validation', () => {
      it('ensures items are provided in request', async () => {
        currency = 'GBP';
        args = { currency };

        scope = mockCurrencyRequest(currency, gbpResponse);

        await shop.buy(args).catch((err) => {
          expect(err).to.deep.equal({
            error: {
              errorMessage: 'no items provided in request',
              errorType: 'BAD_REQUEST',
              httpStatus: 422,
            },
          });
          expect(scope.isDone());
        });
      });
      it('ensures currency is provided in request', async () => {
        items = ['apple'];
        args = { items };

        scope = mockCurrencyRequest(currency, gbpResponse);

        await shop.buy(args).catch((err) => {
          expect(scope.isDone());
          expect(err).to.deep.equal({
            error: {
              errorMessage: 'no currency provided in request',
              errorType: 'BAD_REQUEST',
              httpStatus: 422,
            },
          });
        });
      });

      it('ensures provided item is an accepted item', async () => {
        items = ['potato'];
        currency = 'GBP';
        args = { items, currency };

        scope = mockCurrencyRequest(currency, gbpResponse);

        await shop.buy(args).catch((err) => {
          expect(err).to.deep.equal({
            error: {
              errorMessage: 'item: "potato" is not a valid item',
              errorType: 'BAD_REQUEST',
              httpStatus: 422,
            },
          });
          expect(scope.isDone());
        });
      });
    });
    it('ensures provided currency is an accepted currency', async () => {
      items = ['apple'];
      currency = 'MXN';
      args = { items, currency };

      scope = mockCurrencyRequest(currency, gbpResponse);

      await shop.buy(args).catch((err) => {
        expect(err).to.deep.equal({
          error: {
            errorMessage: 'currency: "MXN" is not an accepted currency',
            errorType: 'BAD_REQUEST',
            httpStatus: 422,
          },
        });
        expect(scope.isDone());
      });
    });
  });
});
