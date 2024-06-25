const express = require('express');
const { fazerPedido, listarPedidos, cadastrarTelefone, mudarStatusPedidoParaProntoEntrega, checarPagamento, mudarStatusPedidoParaFinalizado, mudarStatusPedidoEmPreparacao } = require('../controllers/ControladoresPedido');
const { usuarioAutenticado } = require('../controllers/ControladoresProdutos');

const rotasPedido = express();

module.exports = rotasPedido;

//Rota para criar um novo pedido

rotasPedido.post('/novopedido', fazerPedido)

//Rota para finalizar um pedido

rotasPedido.post('/checarpagamento', usuarioAutenticado, checarPagamento)

//Cadastrar telefone para notificação

rotasPedido.post('/cadastrartelefone', cadastrarTelefone)

//Listar pedidos feitos

rotasPedido.get('/listarPedidos', listarPedidos);

//Atualizar o status do pedido para "em preparação"

rotasPedido.post('/empreparacao/:pedido_id', usuarioAutenticado, mudarStatusPedidoEmPreparacao)

//Atualizar o status do pedido para pronto para entrega e enviar notificação para o cliente

rotasPedido.post('/prontoparaentrega/:pedido_id', usuarioAutenticado, mudarStatusPedidoParaProntoEntrega)

//Atualizar o status para finalizado quando entregar

rotasPedido.post('/pedidofinalizado/:pedido_id', usuarioAutenticado, mudarStatusPedidoParaFinalizado)

