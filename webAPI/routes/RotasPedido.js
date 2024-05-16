const express = require('express');
const { fazerPedido, finalizarPedido } = require('../controllers/ControladoresPedido');

const rotasPedido = express();

module.exports = rotasPedido;

//Rota para criar um novo pedido

rotasPedido.post('/novopedido', fazerPedido)

//Rota de pagamento


//Rota para finalizar um pedido

rotasPedido.post('/finalizarpedido', finalizarPedido)