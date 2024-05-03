const Joi = require('joi');

// Schemas de cliente
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

//Schemas de pedido

const schemaItemPedido = Joi.object({
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
});

const schemaDetalhesPedido = Joi.array().min(1).items(schemaItemPedido).required().messages({
    'array.min': 'Pelo menos um detalhe de pedido deve ser fornecido.',
    'any.required': 'Os detalhes do pedido são obrigatórios.'
});

//Schema de produtos

const schemaProduto = Joi.object({
    nome_produto: Joi.string().trim().required().max(100).messages({
        'any.required': 'O nome do produto é obrigatório.',
        'string.empty': 'O nome do produto não pode estar vazio.',
        'string.trim': 'O nome do produto não pode conter apenas espaços em branco.',
        'string.max': 'O nome do produto deve ter no máximo {{#limit}} caracteres.'
    }),
    preco: Joi.number().precision(2).positive().required().messages({
        'any.required': 'O preço é obrigatório.',
        'number.base': 'O preço deve ser um número.',
        'number.precision': 'O preço deve ter no máximo duas casas decimais.',
        'number.positive': 'O preço deve ser um valor positivo.'
    }),
    categoria_id: Joi.number().integer().positive().required().messages({
        'any.required': 'A categoria é obrigatória.',
        'number.base': 'A categoria deve ser um número inteiro.',
        'number.positive': 'A categoria deve ser um número positivo.'
    }),
    descricao: Joi.string().allow('').max(255).messages({
        'string.max': 'A descrição deve ter no máximo {{#limit}} caracteres.'
    }),
    imagem: Joi.string().allow('').uri().max(255).messages({
        'string.uri': 'A URL da imagem não é válida.',
        'string.max': 'A URL da imagem deve ter no máximo {{#limit}} caracteres.'
    })
})

module.exports = {
    schemaCliente,
    schemaCPF,
    schemaDetalhesPedido,
    schemaProduto
}