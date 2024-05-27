const express = require('express');
const { adicionarProduto, editarProduto, excluirProduto, listarProdutosCategoria, usuarioAutenticado } = require('../controllers/ControladoresProdutos');

const rotasProdutos = express();


//Criar autenticador para rotas de produto
rotasProdutos.post('/cadastrarproduto', usuarioAutenticado, adicionarProduto)

rotasProdutos.patch('/editarproduto/:id', usuarioAutenticado, editarProduto)

rotasProdutos.delete('/excluirproduto/:id', usuarioAutenticado, excluirProduto)

rotasProdutos.get('/categoria/:categoria_id', listarProdutosCategoria)

module.exports = rotasProdutos