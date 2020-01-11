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
      name: 'buy 3 milk, get 50c off',
    },
  },
  bread: { price: 0.8 },
  soup: { price: 0.65 },
};

const handleItems = (items) => {
  const order = {
    subtotal: 0,
    discountAmt: 0,
    discounts: [],
  };

  items.forEach((item) => {
    if (!Object.prototype.hasOwnProperty.call(order, item)) {
      order[item] = { count: 0, price: 0 };
    }
    order[item].count += 1;
    order[item].price += catalog[item].price;
    order.subtotal += catalog[item].price;
  });

  return order;
};

exports.buy = (items, currency) => {
  const order = handleItems(items);

  order.total = 0;
  order.currency = currency;

  return order;
};
