const pool = require("../../infrastructure/persistence/Database");
const vonage = require("../notifications/EnvioSMS");

async function enviarSMS(to, text) {
    try {
        const response = await vonage.sms.send({ to, from: 'Nome do restaurante', text });
        console.log('SMS enviado com sucesso para', to);
        return true;
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return false;
    }
}

module.exports = enviarSMS;