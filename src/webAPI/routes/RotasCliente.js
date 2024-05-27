const express = require('express');
const { cadastrarCliente, identificarCliente, listarClientes } = require('../controllers/ControladoresCliente');
const { usuarioAutenticado } = require('../controllers/ControladoresProdutos');

const rotasCliente = express();

//Rota para criar um novo usuário

rotasCliente.post('/cadastrar', cadastrarCliente)

//Rota para cliente que se identificar via CPF

rotasCliente.post('/identificar', identificarCliente)

//Rota para listar todos os clientes cadastrados. Precisa de autenticação

rotasCliente.get('/listarclientes', usuarioAutenticado, listarClientes)

module.exports = rotasCliente;