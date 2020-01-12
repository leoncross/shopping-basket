const { currencies, catalog } = require('./config');

const errorMsg = {
  error: {
    errorMessage: undefined,
    errorType: 'BAD_REQUEST',
    httpStatus: 422,
  },
};

const checkItemIsDefined = (data) => {
  if (!data.items) {
    errorMsg.error.errorMessage = 'no items provided in request';
    throw errorMsg;
  }
};

const checkCurrencyIsDefined = (data) => {
  if (!data.currency) {
    errorMsg.error.errorMessage = 'no currency provided in request';
    throw errorMsg;
  }
};

const checkItemsAreInCatalog = (data) => {
  data.items.forEach((item) => {
    if (!catalog[item]) {
      errorMsg.error.errorMessage = `item: "${item}" is not a valid item`;
      throw errorMsg;
    }
  });
};

const checkCurrencyIsAccepted = (data) => {
  if (!Object.prototype.hasOwnProperty.call(currencies, data.currency)) {
    errorMsg.error.errorMessage = `currency: "${data.currency}" is not an accepted currency`;
    throw errorMsg;
  }
};

const argumentValidation = (data) => {
  try {
    checkItemIsDefined(data);
    checkCurrencyIsDefined(data);

    checkItemsAreInCatalog(data);
    checkCurrencyIsAccepted(data);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  argumentValidation,
};
