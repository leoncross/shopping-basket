const catalog = {
  apple: {
    price: 1,
    offer: {
      type: 'percentage',
      amountOff: 0.1,
      minPurchase: 1,
      name: '10% off apples',
    },
  },
  milk: {
    price: 1.15,
    offer: {
      type: 'fixed',
      amountOff: 0.5,
      minPurchase: 3,
      name: 'buy 3 milks, get 50c off',
    },
  },
  bread: { price: 0.8 },
  soup: { price: 0.65 },
};

const currencies = {
  GBP: 'GBP',
  EUR: 'EUR',
  USD: 'USD',
};

module.exports = {
  catalog,
  currencies,
};
