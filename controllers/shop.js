const shopModel = require('../models/shop');

exports.buy = (req, res) => {
  const { items, currency } = req.body;

  shopModel.buy(items, currency);

  res.status(200);
  res.json({ items, currency });
};
