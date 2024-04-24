const express = require('express');
const rotasCliente = require('../webAPI/routes/RotasCliente');
const rotasPedido = require('../webAPI/routes/RotasPedido');

const app = express();

app.use(express.json());

app.use(rotasCliente);
app.use(rotasPedido)

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.listen(3000);