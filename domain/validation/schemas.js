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

// Esquema para o pedido detalhado
const schemaDetalhesPedido = Joi.object({
    detalhes_pedido: Joi.array().min(1).items(Joi.object({
        nome_produto: Joi.string().required().messages({
            'string.base': 'O nome do produto deve ser uma string.',
            'any.required': 'O nome do produto é obrigatório.'
        }),
        preco: Joi.number().positive().required().messages({
            'number.base': 'O preço deve ser um número.',
            'number.positive': 'O preço deve ser um número positivo.',
            'any.required': 'O preço é obrigatório.'
        }),
        quantidade: Joi.number().integer().positive().required().messages({
            'number.base': 'A quantidade deve ser um número.',
            'number.integer': 'A quantidade deve ser um número inteiro.',
            'number.positive': 'A quantidade deve ser um número positivo.',
            'any.required': 'A quantidade é obrigatória.'
        })
    })).required().messages({
        'array.min': 'Pelo menos um detalhe de pedido deve ser fornecido.',
        'any.required': 'Os detalhes do pedido são obrigatórios.'
    })
});

//Esquema para o pedido completo

const schemaPedidoCompleto = Joi.object({
    cliente_id: Joi.number().integer().positive().required().messages({
        'number.base': 'O ID do cliente deve ser um número.',
        'number.integer': 'O ID do cliente deve ser um número inteiro.',
        'number.positive': 'O ID do cliente deve ser um número positivo.',
        'any.required': 'O ID do cliente é obrigatório.'
    }),
    detalhes_pedido: Joi.array()
    //Corrigir essa validação

    // .min(1).items(schemaDetalhesPedido).required().messages({
    //     'array.min': 'Pelo menos um detalhe de pedido deve ser fornecido.',
    //     'any.required': 'Os detalhes do pedido são obrigatórios.'
    // })
});

module.exports = {
    schemaCliente,
    schemaCPF,
    schemaPedidoCompleto
}