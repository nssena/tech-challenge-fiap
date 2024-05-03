const pool = require("../../infrastructure/persistence/Database");
const { schemaProduto } = require("../validation/schemas");

class Produto {
    constructor(nome_produto, preco, categoria_id, descricao, imagem) {
        this.nome_produto = nome_produto;
        this.preco = preco;
        this.categoria_id = categoria_id;
        this.descricao = descricao;
        this.imagem = imagem;
    }

    async adicionarProduto() {
        try {
            //validação de esquema
            const { error } = schemaProduto.validate({ nome_produto: this.nome_produto, preco: this.preco, categoria_id: this.categoria_id, descricao: this.descricao, imagem: this.imagem });
            if (error) {
                throw new Error(error.details[0].message);
            }

            //Conferir se a categoria já existe, as categorias 
            //Conferir se o produto já foi cadastrado

            // inclusão no banco
            const query = 'insert into produtos (nome_produto, preco, categoria_id, descricao, imagem) values ($1, $2, $3, $4, $5)';
            await pool.query(query, [this.nome_produto, this.preco, this.categoria_id, this.descricao, this.imagem]);
            
        } catch (error) {
            throw new Error('Erro ao adicionar produto: ' + error.message);
        }
    }
}

module.exports = Produto