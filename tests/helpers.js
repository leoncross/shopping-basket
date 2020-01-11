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

module.exports = {
  getUrl,
  usdResponse,
  gbpResponse,
};
