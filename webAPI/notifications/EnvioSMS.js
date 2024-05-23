const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
    apiKey: "f9828bfd",
    apiSecret: "QO6NV660xcixTCwz"
  });

module.exports = vonage