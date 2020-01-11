const express = require('express');

const router = express.Router();
const shopController = require('../controllers/shop');

router.post('/buy', shopController.buy);

module.exports = router;
