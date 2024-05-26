const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const enviarMensagem = async (mensagem, para) => {
  try {
    const message = await client.messages.create({
      body: mensagem,
      from: '+13205370863', 
      to: para
    });
    return message.sid;
  } catch (error) {
    throw error; 
  }
};

module.exports = enviarMensagem;