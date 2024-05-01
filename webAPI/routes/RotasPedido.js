const express = require('express');
const { fazerPedido } = require('../controllers/ControladoresPedido');

const rotasPedido = express();

module.exports = rotasPedido;

//Rota para criar um novo pedido

rotasPedido.post('/novopedido', fazerPedido)