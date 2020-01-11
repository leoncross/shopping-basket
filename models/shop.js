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

const handleDiscounts = (order, item) => {
  if (order[item].count % catalog[item].offer.minPurchase === 0) {
    const orderDiscounted = order;
    orderDiscounted.discounts.push(catalog[item].offer.name);

    if (catalog[item].offer.type === 'fixed') {
      orderDiscounted.discountAmt = catalog[item].offer.amountOff;
    }
    if (catalog[item].offer.type === 'percentage') {
      orderDiscounted.discountAmt = order[item].price * catalog[item].offer.amountOff;
    }
    return orderDiscounted;
  }
  return order;
};

const handleItems = (items) => {
  let order = {
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

    if (catalog[item].offer) {
      order = handleDiscounts(order, item);
    }
  });

  return order;
};

exports.buy = (items, currency) => {
  const order = handleItems(items);

  order.total = 0;
  order.currency = currency;
  return order;
};
