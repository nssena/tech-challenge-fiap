const express = require('express');
const { adicionarProduto } = require('../controllers/ControladoresProdutos');

const rotasProdutos = express();

//Rota para criar um novo produto
rotasProdutos.post('/novoproduto', adicionarProduto)

module.exports = rotasProdutos