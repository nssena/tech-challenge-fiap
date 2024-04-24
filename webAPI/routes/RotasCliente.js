const express = require('express');
const { cadastrarUsuario, identificarCliente, redirecionarClienteAnonimo } = require('../controllers/ControladoresCliente');

const rotasCliente = express();

//Rota para criar um novo usuário

rotasCliente.post('/novocliente', cadastrarUsuario)

//Rota para cliente sem identificação

rotasCliente.post('/anonimo', redirecionarClienteAnonimo)

//Rota para cliente que se identificar via CPF

rotasCliente.post('/cliente', identificarCliente)

module.exports = rotasCliente;