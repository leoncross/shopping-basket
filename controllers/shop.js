exports.buy = (req, res) => {
  const { items, currency } = req.body;

  res.status(200);
  res.json({ items, currency });
};
