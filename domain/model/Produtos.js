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

            //Conferir se a categoria já existe
            const categoriaExiste = await verificarCategoriaExistente(this.categoria_id);
            if (!categoriaExiste) {
                throw new Error('A categoria especificada não existe.');
            }

            //Conferir se o produto já foi cadastrado
            const produtoCadastrado = await verificarProdutoCadastrado(this.nome_produto);
            if (produtoCadastrado) {
                throw new Error('Este produto já foi cadastrado anteriormente.');
            }

            const query = 'insert into produtos (nome_produto, preco, categoria_id, descricao, imagem) values ($1, $2, $3, $4, $5)';
            await pool.query(query, [this.nome_produto, this.preco, this.categoria_id, this.descricao, this.imagem]);
            
        } catch (error) {
            throw new Error('Erro ao adicionar produto: ' + error.message);
        }
    }    
}

async function verificarCategoriaExistente(categoria_id) {
    try {
        const query = 'SELECT * FROM categorias WHERE id = $1';
        const result = await pool.query(query, [categoria_id]);
        
        if (result.rows.length === 0) {
            return false;
        }
        
        return true;
    } catch (error) {
        throw new Error('Erro ao verificar categoria existente: ' + error.message);
    }
}

async function verificarProdutoCadastrado(nome_produto) {
    try {
        const query = 'SELECT * FROM produtos WHERE nome_produto = $1';
        const result = await pool.query(query, [nome_produto]);
        
        if (result.rows.length === 0) {
            return false;
        }
        
        return true;
    } catch (error) {
        throw new Error('Erro ao verificar produto cadastrado: ' + error.message);
    }
}

module.exports = Produto