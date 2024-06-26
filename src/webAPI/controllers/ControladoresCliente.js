const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = require("../../infrastructure/persistence/Database")
const Cliente = require('../../domain/model/Cliente');

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf } = req.body;

    try {
        const cliente = new Cliente(nome, email, cpf);
        const resultadoCadastro = await cliente.cadastrar();
    
        if (resultadoCadastro === true) {
            const token = cliente.gerarToken();
            res.cookie('token', token, { httpOnly: true });
            res.status(201).json({ mensagem: "Cliente cadastrado com sucesso" });
            

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
        return res.status(200).json({ token })

        // redirecionar para a página de pedidos ou apresentar um botão para a pessoa iniciar o pedido com o link da página de produtos

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao identificar cliente: " + error.message });
    }
};

const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.listarTodos();
        return res.status(200).json(clientes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar clientes: " + error.message });
    }
};

module.exports = {
    cadastrarCliente,
    identificarCliente,
    listarClientes
}
