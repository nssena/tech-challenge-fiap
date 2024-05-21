const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de pedidos (Tech Challenge FIAP)',
      version: '1.0.0',
      description: 'API para possibilitar criação de pedidos em um restaurante. É possível criar pedidos de clientes cadastrados',
    },
  },
  apis: ['./webAPI/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
