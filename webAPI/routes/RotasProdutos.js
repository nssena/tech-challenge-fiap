const express = require('express');
const { adicionarProduto, editarProduto, excluirProduto } = require('../controllers/ControladoresProdutos');

const rotasProdutos = express();

//Rota para criar um novo produto
rotasProdutos.post('/novoproduto', adicionarProduto)

rotasProdutos.put('', editarProduto)

rotasProdutos.delete('', excluirProduto)

module.exports = rotasProdutos