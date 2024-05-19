const express = require('express');
const { adicionarProduto, editarProduto, excluirProduto } = require('../controllers/ControladoresProdutos');

const rotasProdutos = express();

//Rota para criar um novo produto
rotasProdutos.post('/novoproduto', adicionarProduto)

rotasProdutos.patch('/editarproduto/:id', editarProduto)

rotasProdutos.delete('/excluirproduto/:id', excluirProduto)

module.exports = rotasProdutos