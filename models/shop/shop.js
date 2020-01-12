const {
  argumentValidation, handleItems, convertOrder, formatOrder,
} = require('./buy');

exports.buy = async (data) => {
  let finalisedOrder;

  try {
    argumentValidation(data);
    const { items, currency } = data;
    const order = handleItems(items);
    const convertedOrder = await convertOrder(order, currency);
    finalisedOrder = formatOrder(convertedOrder);
  } catch (err) {
    throw err;
  }

  return finalisedOrder;
};
