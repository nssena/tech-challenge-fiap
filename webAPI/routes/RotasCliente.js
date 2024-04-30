const express = require('express');
const { cadastrarCliente, identificarCliente } = require('../controllers/ControladoresCliente');

const rotasCliente = express();

//Rota para criar um novo usuário

rotasCliente.post('/novocliente', cadastrarCliente)

//Rota para cliente que se identificar via CPF

rotasCliente.post('/cliente', identificarCliente)

module.exports = rotasCliente;