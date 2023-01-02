require('dotenv').config();

export const env_variables = {
  proxyLicenseKey: process.env.PROXY_LICENSE_KEY,
  proxySecretKey: process.env.PROXY_SECRET_KEY,
  proxyCount: process.env.PROXY_COUNT,
  proxyFlag: process.env.PROXY_FLAG,
};

export const location = ["US", "ID", "PH", "MY", "RU", "ES", "TH"]
