const express = require('express');
const rotasCliente = require('../webAPI/routes/RotasCliente');
const rotasPedido = require('../webAPI/routes/RotasPedido');
const rotasProdutos = require('../webAPI/routes/RotasProdutos');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('../../swagger.json');
require('dotenv').config();


const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(rotasCliente);
app.use(rotasPedido);
app.use(rotasProdutos);

app.get('/', (req, res) => {
    res.send('Funcionando')
})

app.get('/health', (req, res) => {
    res.status(200).send('Application is healthy');
});

app.listen(3000);