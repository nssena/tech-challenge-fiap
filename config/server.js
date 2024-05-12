const express = require('express');
const rotasCliente = require('../webAPI/routes/RotasCliente');
const rotasPedido = require('../webAPI/routes/RotasPedido');
const rotasProdutos = require('../webAPI/routes/RotasProdutos');
const mercadopago = require('../domain/model/MercadoPago');

const app = express();

app.use(express.json());

app.use(rotasCliente);
app.use(rotasPedido);
app.use(rotasProdutos);

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.listen(3000);