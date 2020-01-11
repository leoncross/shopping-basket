const {
  argumentValidation, handleItems, convertOrder, formatOrder,
} = require('./buy');

exports.buy = async (items, currency) => {
  const { isValid, errorMsg } = argumentValidation(items, currency);
  if (!isValid) return errorMsg;

  const order = handleItems(items);
  const convertedOrder = await convertOrder(order, currency);
  const finalisedOrder = formatOrder(convertedOrder);

  return finalisedOrder;
};
