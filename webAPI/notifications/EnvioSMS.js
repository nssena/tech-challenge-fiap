const accountSid = "AC7829b08c6538ea9e33e96106ff056039";
const authToken = "b078b449c74c20e33ce7c21c688e5ce2";
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