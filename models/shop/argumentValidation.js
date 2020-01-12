const { currencies, catalog } = require('./config');

const argumentValidation = (data) => {
  const errorMsg = {
    error: {
      errorMessage: undefined,
      errorType: 'BAD_REQUEST',
      httpStatus: 422,
    },
  };

  if (!data.items) {
    errorMsg.error.errorMessage = 'no items provided in request';
    throw errorMsg;
  }

  if (!data.currency) {
    errorMsg.error.errorMessage = 'no currency provided in request';
    throw errorMsg;
  }

  data.items.forEach((item) => {
    if (!catalog[item]) {
      errorMsg.error.errorMessage = `item: "${item}" is not a valid item`;
      throw errorMsg;
    }
  });

  if (!Object.prototype.hasOwnProperty.call(currencies, data.currency)) {
    errorMsg.error.errorMessage = `currency: "${data.currency}" is not an accepted currency`;
    throw errorMsg;
  }
};

module.exports = {
  argumentValidation,
};
