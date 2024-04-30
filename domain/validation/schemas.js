const Joi = require('joi');

// Esquema para a tabela 'clientes'
const schemaCliente = Joi.object({
    nome: Joi.string().max(50).required().messages({
        'string.base': 'O nome do cliente deve ser uma string',
        'string.max': 'O nome do cliente deve ter no máximo {#limit} caracteres',
        'any.required': 'O nome do cliente é obrigatório'
    }),
    email: Joi.string().email().max(100).required().messages({
        'string.email': 'O email fornecido é inválido',
        'string.max': 'O email do cliente deve ter no máximo {#limit} caracteres',
        'any.required': 'O email do cliente é obrigatório'
    }),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'O CPF do cliente deve ter 11 dígitos',
        'string.pattern.base': 'O CPF do cliente deve conter apenas números',
        'any.required': 'O CPF do cliente é obrigatório'
    })
});

const schemaCPF = Joi.object({
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'O CPF do cliente deve ter 11 dígitos',
        'string.pattern.base': 'O CPF do cliente deve conter apenas números',
        'any.required': 'O CPF do cliente é obrigatório'
    })
});

// Esquema para a tabela 'pedidos'
const schemaPedido = Joi.object({
    cliente_id: Joi.number().integer().positive().required().messages({
        'number.base': 'O ID do cliente deve ser um número',
        'number.integer': 'O ID do cliente deve ser um número inteiro',
        'number.positive': 'O ID do cliente deve ser um número positivo',
        'any.required': 'O ID do cliente é obrigatório'
    }),
    preco_total: Joi.number().precision(2).positive().required().messages({
        'number.base': 'O preço total do pedido deve ser um número',
        'number.precision': 'O preço total do pedido deve ter no máximo duas casas decimais',
        'number.positive': 'O preço total do pedido deve ser um número positivo',
        'any.required': 'O preço total do pedido é obrigatório'
    })
});

// Esquema para a tabela 'pedido_detalhado'
const schemaPedidoDetalhado = Joi.object({
    pedido_id: Joi.number().integer().positive().required().messages({
        'number.base': 'O ID do pedido deve ser um número',
        'number.integer': 'O ID do pedido deve ser um número inteiro',
        'number.positive': 'O ID do pedido deve ser um número positivo',
        'any.required': 'O ID do pedido é obrigatório'
    }),
    nome_produto: Joi.string().max(100).required().messages({
        'string.base': 'O nome do produto deve ser uma string',
        'string.max': 'O nome do produto deve ter no máximo {#limit} caracteres',
        'any.required': 'O nome do produto é obrigatório'
    }),
    preco: Joi.number().precision(2).positive().required().messages({
        'number.base': 'O preço do produto deve ser um número',
        'number.precision': 'O preço do produto deve ter no máximo duas casas decimais',
        'number.positive': 'O preço do produto deve ser um número positivo',
        'any.required': 'O preço do produto é obrigatório'
    }),
    quantidade: Joi.number().integer().positive().required().messages({
        'number.base': 'A quantidade do produto deve ser um número',
        'number.integer': 'A quantidade do produto deve ser um número inteiro',
        'number.positive': 'A quantidade do produto deve ser um número positivo',
        'any.required': 'A quantidade do produto é obrigatória'
    })
});

module.exports = {
    schemaCliente,
    schemaCPF,
    schemaPedido,
    schemaPedidoDetalhado
}