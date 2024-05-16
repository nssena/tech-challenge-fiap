const QrCode = require("../../domain/model/MercadoPago");
const Pedido = require("../../domain/model/Pedido");
const axios = require('axios');
require('dotenv').config();



const fazerPedido = async (req, res) => {
  const { cliente_id, detalhes_pedido } = req.body;

  try {
    const pedido = new Pedido(cliente_id);

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
        return statusPagamento;
      } else {
        console.error('Erro ao acessar a API');
        return null;
      }
    } catch (error) {
      console.error('Erro ao acessar a API:', error.message);
      return null;
    }
  };

  // processar pedido
  try {
    const { resource } = req.body;
    const orderId = resource.split('/').pop();
    const accessToken = "TEST-5964076815976378-051520-8a77a9bead5df7df19b07595bfdef256-1795241025";

    const statusPagamento = await checarStatusPagamento(orderId, accessToken);

    if (statusPagamento === 'paid') {
      console.log('Pedido pago!');
      // Coloque aqui o código para atualizar no banco de dados que o pedido foi pago
    } else {
      console.log('Pedido ainda não pago.');
    }

    res.status(200).send('Notificação de pagamento recebida com sucesso.');
  } catch (error) {
    console.error('Erro ao lidar com a notificação de pagamento:', error.message);
    res.status(500).send('Erro ao lidar com a notificação de pagamento.');
  }
};

module.exports = {
  fazerPedido,
  finalizarPedido
}