const pool = require("../../infrastructure/persistence/Database");
const vonage = require("../notifications/EnvioSMS");

async function sendSMS(to, text) {
    try {
        const response = await vonage.sms.send({ to, from: 'Nome do restaurante', text });
        console.log('SMS enviado com sucesso para', to);
        return true;
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return false;
    }
}

pool.connect((err, client, done) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }

    const createTriggerQuery = `
    CREATE OR REPLACE FUNCTION enviar_notificacao_pedido_pronto()
    RETURNS TRIGGER AS
    $$
    BEGIN
        IF NEW.status_pedido = 'pronto para entrega' THEN
            -- Obter o número de telefone do cliente
            DECLARE to_number TEXT;
            SELECT telefone INTO to_number FROM clientes WHERE cliente_id = NEW.cliente_id;
            -- Enviar SMS se o número de telefone não for nulo
            IF to_number IS NOT NULL THEN
                PERFORM sendSMS(to_number, 'Seu pedido está pronto para entrega!');
            END IF;
        END IF;
        RETURN NEW;
    END;
    $$
    LANGUAGE plpgsql;

    CREATE TRIGGER trigger_pedido_pronto
    AFTER UPDATE OF status_pedido ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION enviar_notificacao_pedido_pronto();
    `;

    client.query(createTriggerQuery, (err, result) => {
        done();
        if (err) {
            console.error('Erro ao criar o gatilho:', err);
        } else {
            console.log('Gatilho criado com sucesso!');
        }
    });
});