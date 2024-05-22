const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = require('../../infrastructure/persistence/Database');
const { schemaCliente, schemaCPF } = require('../validation/schemas');

class Cliente {
    constructor(nome, email, cpf) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
    }

    async cadastrar() {
        try {
            const { error } = schemaCliente.validate({ nome: this.nome, email: this.email, cpf: this.cpf });
            if (error) {
                throw new Error(error.details[0].message);
            }

            const emailCadastrado = await this.verificarEmailExistente();
            if (emailCadastrado) {
                throw new Error("Cliente já cadastrado");
            }

            const cpfCadastrado = await this.verificarCpfExistente();
            if (cpfCadastrado) {
                throw new Error("Cliente já cadastrado");
            }

            const query = 'insert into clientes (nome, email, cpf) values ($1, $2, $3)';
            const novoClienteCadastrado = await pool.query(query, [this.nome, this.email, this.cpf]);

            if (novoClienteCadastrado.rowCount === 1) {
                return true;
            } else {
                throw new Error("Erro ao cadastrar cliente");
            }

        } catch (error) {
            return { error: "Erro ao cadastrar cliente: " + error.message };
        }
    }

    async identificar() {
        try {
            const { error } = schemaCPF.validate({ cpf: this.cpf });
            if (error) {
                throw new Error(error.details[0].message);
            }

            const cpfCadastrado = await this.verificarCpfExistente();
            if (cpfCadastrado) {
                return this.gerarToken();
            } else {
                throw new Error("Cliente não encontrado");
            }
        } catch (error) {
            throw new Error('Erro interno do servidor.');
        }
    }

    async verificarEmailExistente() {
        const emailConsultado = 'select * from clientes where email = $1';
        const resultadoConsultaEmail = await pool.query(emailConsultado, [this.email]);

        return resultadoConsultaEmail.rows.length > 0;
    }

    async verificarCpfExistente() {
        const cpfConsultado = 'select * from clientes where cpf = $1';
        const resultadoConsultaCpf = await pool.query(cpfConsultado, [this.cpf]);

        return resultadoConsultaCpf.rows.length > 0;
    }

    gerarToken() {
        const chaveSecreta = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({ cpf: this.cpf }, chaveSecreta);
        return token;
    }
}

module.exports = Cliente;
