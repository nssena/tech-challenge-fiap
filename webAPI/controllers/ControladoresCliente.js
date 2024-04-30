const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = require("../../infrastructure/persistence/Database")
const Cliente = require('../../domain/model/Cliente');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    try {
        const cliente = new Cliente(nome, email, cpf);
        const resultadoCadastro = await cliente.cadastrar();
        
        if (!resultadoCadastro) {
            const token = cliente.gerarToken();
            res.cookie('token', token, { httpOnly: true });
            console.log(token);
            res.status(201).json({ mensagem: "Cliente cadastrado com sucesso" });
            // return res.redirect(302, '/pagina-de-vendas');
        } else {
            return res.status(400).json({ mensagem: resultadoCadastro.error });
        }

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor: " + error.message });
    }
};

const identificarCliente = async (req, res) => {
    const { cpf } = req.body;
    const cliente = new Cliente(undefined, undefined, cpf);
    try {
        const token = await cliente.identificar();
        return res.redirect(302, '/pagina-de-pedidos?token=' + token);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao identificar cliente: " + error.message });
    }
};

module.exports = {
    cadastrarCliente,
    identificarCliente
}
