require('dotenv').config();
const fetch = require('node-fetch');

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

const acceptedCurrencies = {
  GBP: 'GBP',
  EUR: 'EUR',
  USD: 'USD',
};

const argumentValidation = (items, currency) => {
  let isValid = true;

  items.forEach((item) => {
    if (!catalog[item]) {
      isValid = false;
    }
  });

  if (!Object.prototype.hasOwnProperty.call(acceptedCurrencies, currency)) {
    isValid = false;
  }

  const errorMsg = {
    errorMessage: 'invalid argument provided',
    errorType: 'BAD_REQUEST',
  };
  return {
    isValid,
    errorMsg,
  };
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

exports.buy = async (items, currency) => {
  const { isValid, errorMsg } = argumentValidation(items, currency);
  if (!isValid) return errorMsg;

  const order = handleItems(items);
  const convertedOrder = await convertOrder(order, currency);
  const finalisedOrder = formatOrder(convertedOrder);

  return finalisedOrder;
};
