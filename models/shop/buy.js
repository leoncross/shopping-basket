require('dotenv').config();
const fetch = require('node-fetch');

const { catalog } = require('./shopConfig');

const handleDiscounts = (order, item) => {
  if (order[item].count % catalog[item].offer.minPurchase === 0) {
    const orderDiscounted = order;
    orderDiscounted.discounts.push(catalog[item].offer.name);

    if (catalog[item].offer.type === 'fixed') {
      orderDiscounted.discountAmt += catalog[item].offer.amountOff;
    }
    if (catalog[item].offer.type === 'percentage') {
      orderDiscounted.discountAmt += catalog[item].price * catalog[item].offer.amountOff;
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
    total: 0,
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

const getConversionRate = async (currency) => {
  const url = `http://apilayer.net/api/live?access_key=${process.env.API_KEY}&currencies=${currency}&format=1`;

  return fetch(url)
    .then(data => data.json())
    .then((data) => {
      const currencyFormatted = `USD${currency}`;
      return data.quotes[currencyFormatted];
    });
};

const convertOrder = async (order, currency) => {
  const convertedOrder = order;
  const conversionRate = await getConversionRate(currency);

  convertedOrder.subtotal *= conversionRate;
  convertedOrder.discountAmt *= conversionRate;
  convertedOrder.total *= conversionRate;
  convertedOrder.currency = currency;

  return convertedOrder;
};

const formatOrder = (order) => {
  const subtotal = +order.subtotal.toFixed(2);
  const { discounts } = order;
  const discountAmt = +order.discountAmt.toFixed(2);
  const total = +(order.subtotal - order.discountAmt).toFixed(2);
  const { currency } = order;

  return {
    subtotal,
    discounts,
    discountAmt,
    total,
    currency,
  };
};

module.exports = {
  handleItems,
  convertOrder,
  formatOrder,
};
