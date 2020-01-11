const shopModel = require('../models/shop');

exports.buy = async (req, res) => {
  const { items, currency } = req.body;

  const order = await shopModel.buy(items, currency);

  res.status(200);
  res.json(order);
};
