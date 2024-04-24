const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { schemaClient, schemaCPF } = require("../../domain/model/Cliente")
const pool = require("../../infrastructure/persistence/Database")
const { verificarEmailExistente, verificarCpfExistente } = require("../functions")

//Cadastrar um novo cliente na base
const cadastrarUsuario = async (req, res) => {
    const { nome, email, cpf} = req.body

    try {
        //Validação do esquema de envio de dados
        const {error} = schemaClient.validate({ nome, email, cpf })

        if (error) {
            return res.status(400).json({ mensagem: error.details[0].message })
        }

        //Validar se o cliente já está cadastrado
        const emailCadastrado = await verificarEmailExistente(email);
        if (emailCadastrado.cadastrado) {
            return res.status(400).json({ mensagem: "Cliente já cadastrado"})
        }

        const cpfCadastrado = await verificarCpfExistente(cpf);
        if (cpfCadastrado.cadastrado) {
            return res.status(400).json({ mensagem: "Cliente já cadastrado"})
        }

        //Cadastro do novo cliente na base
        const query = 'insert into clients (nome, email, cpf) values ($1, $2, $3)'
        await pool.query(query, [nome, email, cpf])

        const chaveSecreta = crypto.randomBytes(32).toString('hex');
            const token = jwt.sign({ cpf }, chaveSecreta);

            //REDIRECIONAMENTO PARA PÁGINA DE PRODUTOS PARA PEDIDO
            // return res.direct(302, '/pagina-de-pedidos?token=' + token)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.'})
    }
}

//Identificar cliente através do CPF
const identificarCliente = async (req, res) => {
    const { cpf } = req.body

    const { error } = schemaCPF.validate({ cpf })
    try {        
        if (error) {
            return res.status(400).json({ mensagem: error.details[0].message })
        }

        //Validar se o cliente já está cadastrado
        const cpfCadastrado = await verificarCpfExistente(cpf);
        if (cpfCadastrado.cadastrado) {
            const chaveSecreta = crypto.randomBytes(32).toString('hex');
            const token = jwt.sign({ cpf }, chaveSecreta);

            //REDIRECIONAMENTO PARA PÁGINA DE PRODUTOS PARA PEDIDO
            // return res.direct(302, '/pagina-de-pedidos?token=' + token)
        } else {
            return res.status(400).json({ mensagem: "Cliente não encontrado"})
        }

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.'})

    }
}

//Redirecionar cliente que não quer se identificar
const redirecionarClienteAnonimo = async (req, res) => {
    try {
        //REDIRECIONAMENTO PARA PÁGINA DE PRODUTOS PARA PEDIDO
            // return res.direct(302, '/pagina-de-pedidos)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.'})
    }
}

module.exports = {
    cadastrarUsuario,
    identificarCliente,
    redirecionarClienteAnonimo
}