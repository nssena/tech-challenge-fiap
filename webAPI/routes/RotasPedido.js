const express = require('express');
const { fazerPedido, finalizarPedido, listarPedidos, cadastrarTelefone, mudarStatusPedidoParaProntoEntrega } = require('../controllers/ControladoresPedido');
const { usuarioAutenticado } = require('../controllers/ControladoresProdutos');

const rotasPedido = express();

module.exports = rotasPedido;

//Rota para criar um novo pedido

rotasPedido.post('/novopedido', fazerPedido)

//Rota para finalizar um pedido

rotasPedido.post('/finalizarpedido', finalizarPedido)

//Cadastrar telefone para notificação

rotasPedido.post('/cadastrarTelefone', cadastrarTelefone)

//Listar pedidos feitos

rotasPedido.get('/listarPedidos', listarPedidos);

//Atualizar o status do pedido para pronto para entrega

rotasPedido.post('/prontoparaentrega', usuarioAutenticado, mudarStatusPedidoParaProntoEntrega)
