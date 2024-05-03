const pool = require("../../infrastructure/persistence/Database");
const { schemaProduto } = require("../validation/schemas");

class Produto {
    constructor(nome_produto, preco, categoria) {
        this.nome_produto = nome_produto;
        this.preco = preco;
        this.categoria = categoria;
    }

    async adicionarProduto() {
        try {
            //validação de esquema
            const { error } = schemaProduto.validate({ nome_produto: this.nome_produto, preco: this.preco, categoria: this.categoria });
            if (error) {
                throw new Error(error.details[0].message);
            }

            //Conferir se a categoria já existe, as categorias 
            //Conferir se o produto já foi cadastrado

            // inclusão no banco
            const query = 'insert into produtos (nome_produto, preco, categoria) values ($1, $2, $3)';
            await pool.query(query, [this.nome_produto, this.preco, this.categoria]);
            
        } catch (error) {
            throw new Error('Erro ao adicionar produto: ' + error.message);
        }
    }
}

module.exports = Produto