const Joi = require('joi');

const schemaClient = Joi.object({
    nome: Joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'O e-mail fornecido é inválido.',
        'any.required': 'O campo e-mail é obrigatório.'
    }),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'O CPF deve ter 11 dígitos.',
        'string.pattern.base': 'O CPF deve conter apenas números.',
        'any.required': 'O campo CPF é obrigatório.'
    })
});

const schemaCPF = Joi.object({
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'O CPF deve ter 11 dígitos.',
        'string.pattern.base': 'O CPF deve conter apenas números.',
        'any.required': 'O campo CPF é obrigatório.'
    })
})

module.exports = {
    schemaClient,
    schemaCPF
};
