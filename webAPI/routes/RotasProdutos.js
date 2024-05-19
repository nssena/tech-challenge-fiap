const express = require('express');
const { adicionarProduto, editarProduto, excluirProduto, listarProdutosCategoria } = require('../controllers/ControladoresProdutos');

const rotasProdutos = express();

//Rota para criar um novo produto
rotasProdutos.post('/novoproduto', adicionarProduto)

rotasProdutos.patch('/editarproduto/:id', editarProduto)

rotasProdutos.delete('/excluirproduto/:id', excluirProduto)

rotasProdutos.get('/produtos/categoria/:categoria_id', listarProdutosCategoria)

module.exports = rotasProdutos