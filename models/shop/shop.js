const { handleItems, convertOrder, formatOrder } = require('./buy');
const { argumentValidation } = require('./argumentValidation');

exports.buy = async (data) => {
  try {
    argumentValidation(data);
    const { items, currency } = data;
    const order = handleItems(items);
    const convertedOrder = await convertOrder(order, currency);
    return formatOrder(convertedOrder);
  } catch (err) {
    throw err;
  }
};
