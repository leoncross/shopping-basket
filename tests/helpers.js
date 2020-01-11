const nock = require('nock');

const getUrl = currency => `/api/live?access_key=${process.env.API_KEY}&currencies=${currency}&format=1`;

const usdResponse = {
  success: true,
  terms: 'https://currencylayer.com/terms',
  privacy: 'https://currencylayer.com/privacy',
  timestamp: 1578672546,
  source: 'USD',
  quotes: { USDUSD: 1 },
};
const gbpResponse = {
  success: true,
  terms: 'https://currencylayer.com/terms',
  privacy: 'https://currencylayer.com/privacy',
  timestamp: 1578672546,
  source: 'USD',
  quotes: { USDGBP: 0.766215 },
};

const eurResponse = {
  success: true,
  terms: 'https://currencylayer.com/terms',
  privacy: 'https://currencylayer.com/privacy',
  timestamp: 1578672546,
  source: 'USD',
  quotes: { USDEUR: 0.899901 },
};

const mockCurrencyRequest = (currency, response) => {
  const url = getUrl(currency);
  return nock('http://apilayer.net')
    .get(url)
    .reply(200, response);
};

module.exports = {
  usdResponse,
  gbpResponse,
  eurResponse,
  mockCurrencyRequest,
};
