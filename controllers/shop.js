const shopModel = require('../models/shop');

exports.buy = (req, res) => {
  const { items, currency } = req.body;

  const order = shopModel.buy(items, currency);

  res.status(200);
  res.json(order);
};
