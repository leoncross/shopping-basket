const shopModel = require('../models/shop/index');

exports.buy = async (req, res) => {
  try {
    const order = await shopModel.buy(req.body);
    res.status(200);
    res.json(order);
  } catch (err) {
    res.status(err.error.httpStatus);
    res.json(err);
  }
};
