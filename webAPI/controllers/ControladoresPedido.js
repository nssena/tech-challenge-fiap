const QrCode = require("../../domain/model/MercadoPago");
const Pedido = require("../../domain/model/Pedido");
require('dotenv').config();



const fazerPedido = async (req, res) => {
  const { cliente_id, detalhes_pedido } = req.body;

  try {
    const pedido = new Pedido(cliente_id);

    await pedido.adicionarItemPedido(detalhes_pedido);

    await pedido.gerarQRCode(detalhes_pedido);

    

    return res.status(200).json({ mensagem: "Pedido feito com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor: " + error.message });
  }
}

const finalizarPedido = async (req, res) => {
  const { cliente_id, detalhes_pedido } = req.body;
  try {
    const pedido = new Pedido(cliente_id);

    console.log(pedido);

    await pedido.enviarPedidosParaBancoDeDados(detalhes_pedido);

    res.status(200).json({ mensagem: 'Pedidos enviados para o banco de dados com sucesso.' });
  } catch (error) {
    // Responda ao cliente com uma mensagem de erro em caso de falha
    res.status(500).json({ erro: error.message });
  }
};


module.exports = {
  fazerPedido,
  finalizarPedido
}