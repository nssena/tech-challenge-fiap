const QrCode = require("../../domain/model/MercadoPago");
const Pedido = require("../../domain/model/Pedido");
const axios = require('axios');
const pool = require("../../infrastructure/persistence/Database");
const { ValidationError, NotFoundError } = require("../../domain/validation/validationError");
require('dotenv').config();



const fazerPedido = async (req, res) => {
  const { cliente_id, detalhes_pedido } = req.body;

  try {
    const pedido = new Pedido(cliente_id)

    await pedido.adicionarItemPedido(detalhes_pedido);

    const qrCode = await pedido.gerarQRCode(detalhes_pedido);

    return res.status(200).json({ mensagem: "Pedido feito com sucesso.", qrCode: qrCode.qr_data });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ mensagem: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ mensagem: error.message });
    }

    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
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

const mudarStatusPedidoParaProntoEntrega = async (req, res) => {
  const { pedido_id } = req.params;

  try {
    const pedido = await pool.query('SELECT * FROM pedidos WHERE pedido_id = $1', [pedido_id]);
    if (pedido.rowCount === 0) {
      throw new NotFoundError('Pedido não encontrado.');
    }

    await pool.query('UPDATE pedidos SET status_pedido = $1 WHERE pedido_id = $2', ['pronto para entrega', pedido_id]);

    res.status(200).json({ mensagem: 'Status do pedido atualizado para pronto para entrega.' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ mensagem: error.message });
    } else {
      console.error('Erro ao mudar o status do pedido para pronto para entrega:', error);
      res.status(500).json({ mensagem: 'Erro interno ao mudar o status do pedido para pronto para entrega.' });
    }
  }
};


const cadastrarTelefone = async (req, res) => {
  const { cliente_id, telefone } = req.body
  //pop-up para incluir número de telefone e receber a notificação
  try {
    const queryAdicionarTelefone = 'INSERT INTO clientes (telefone) values $1 WHERE cliente_id = $2';
    const novoTelefoneCadastrado = await pool.query(queryAdicionarTelefone, [telefone, cliente_id])

    if (novoTelefoneCadastrado.rowCount > 0) {
      res.status(200).send('Telefone cadastrado com sucesso, aguarde a notificação através deste número.');
    }
  } catch (error) {
    res.status(500).send('Erro interno ao processar a notificação.');
  }
}

const listarPedidos = async (req, res) => {
  try {
    const queryListarPedidos = `
      SELECT pedido_id, tempo_estimado_entrega, status_pedido
      FROM pedidos
      WHERE pagamento = true
    `;
    const { rows } = await pool.query(queryListarPedidos);

    if (rows.length === 0) {
      throw new NotFoundError("Nenhum pedido encontrado");
    }

    return res.status(200).json(rows);
  } catch (error) {

    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ mensagem: error.message });
    }
    return res.status(500).json({ mensagem: "Erro ao listar pedidos: " + error.message });
  }
}

module.exports = {
  fazerPedido,
  finalizarPedido,
  mudarStatusPedidoParaProntoEntrega,
  cadastrarTelefone,
  listarPedidos
}