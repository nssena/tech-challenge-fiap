const express = require('express');
const { fazerPedido, finalizarPedido, listarPedidos, statusTempoEstimado } = require('../controllers/ControladoresPedido');

const rotasPedido = express();

module.exports = rotasPedido;

//Rota para criar um novo pedido

rotasPedido.post('/novopedido', fazerPedido)

//Rota para finalizar um pedido

rotasPedido.post('/finalizarpedido', finalizarPedido)

//Listar pedidos feitos

rotasPedido.get('/listarPedidos', listarPedidos);
