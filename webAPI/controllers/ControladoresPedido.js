const QrCode = require("../../domain/model/MercadoPago");
const Pedido = require("../../domain/model/Pedido");
const axios = require('axios');
const pool = require("../../infrastructure/persistence/Database");
require('dotenv').config();



const fazerPedido = async (req, res) => {
  const { cliente_id, detalhes_pedido } = req.body;

  try {
    const pedido = new Pedido(cliente_id)

    await pedido.adicionarItemPedido(detalhes_pedido);

    const qrCode = await pedido.gerarQRCode(detalhes_pedido);

    return res.status(200).json({ mensagem: "Pedido feito com sucesso.", qrCode: qrCode.qr_data });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor: " + error.message });
  }
}

const finalizarPedido = async (req, res) => {
  // Função para checar o status do pagamento
  const checarStatusPagamento = async (orderId, accessToken) => {
    try {
      const url = `https://api.mercadolibre.com/merchant_orders/${orderId}`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };

      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        const data = response.data;
        const statusPagamento = data.order_status;
        const externalReference = data.external_reference;

        return { statusPagamento, externalReference };
      } else {
        console.error('Erro ao acessar a API');
        return null;
      }
    } catch (error) {
      console.error('Erro ao acessar a API:', error.message);
      return null;
    }
  };

  //Função para atualizar o pedido para pago no banco
  const atualizarPedidoPago = async (externalReference) => {
    try {
      const queryVerificarPedido = 'SELECT * FROM pedidos WHERE external_reference = $1';
      const { rows } = await pool.query(queryVerificarPedido, [externalReference]);

      if (rows.length === 0) {
        throw new Error('Pedido não encontrado');
      }

      const queryAtualizarPedido = 'UPDATE pedidos SET pagamento = true WHERE external_reference = $1';
      await pool.query(queryAtualizarPedido, [externalReference]);

      return 'Pedido atualizado com sucesso';
    } catch (error) {
      throw new Error('Erro ao atualizar pedido: ' + error.message);
    }
  };

  // processar pedido
  try {
    const { resource } = req.body;

    const orderId = resource.split('/').pop();
    const accessToken = "TEST-5964076815976378-051520-8a77a9bead5df7df19b07595bfdef256-1795241025";

    const { statusPagamento, externalReference } = await checarStatusPagamento(orderId, accessToken);

    if (statusPagamento === 'paid') {
      await atualizarPedidoPago(externalReference)

    } else {
      console.log('Pedido ainda não pago.');
    }

    res.status(200).send('Notificação de pagamento recebida com sucesso.');
  } catch (error) {
    console.error('Erro ao lidar com a notificação de pagamento:', error.message);
    res.status(500).send('Erro ao lidar com a notificação de pagamento.');
  }
};

const listarPedidos = async (req, res) => {
  try {
    const queryListarPedidos = `
      SELECT pedido_id, tempo_estimado_entrega, status_pedido
      FROM pedidos
      WHERE pagamento = true
    `;
    const { rows } = await pool.query(queryListarPedidos);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum pedido encontrado" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return res.status(500).json({ mensagem: "Erro ao listar pedidos: " + error.message });
  }
}

module.exports = {
  fazerPedido,
  finalizarPedido,
  listarPedidos
}