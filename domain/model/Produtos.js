const pool = require("../../infrastructure/persistence/Database");
const { schemaProduto } = require("../validation/schemas");

class Produto {
    constructor(nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo) {
        this.nome_produto = nome_produto;
        this.preco = preco;
        this.categoria_id = categoria_id;
        this.descricao = descricao;
        this.imagem = imagem;
        this.tempo_preparo = tempo_preparo;
    }

    async adicionarProduto() {
        try {
            const { error } = schemaProduto.validate({ nome_produto: this.nome_produto, preco: this.preco, categoria_id: this.categoria_id, descricao: this.descricao, imagem: this.imagem, tempo_preparo: this.tempo_preparo });
            if (error) {
                throw new Error(error.details[0].message);
            }

            const categoriaExiste = await verificarCategoriaExistente(this.categoria_id);
            if (!categoriaExiste) {
                throw new Error('A categoria especificada não existe.');
            }

            const produtoCadastrado = await verificarProdutoCadastrado(this.nome_produto);
            if (produtoCadastrado) {
                throw new Error('Este produto já foi cadastrado anteriormente.');
            }

            const query = 'insert into produtos (nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo) values ($1, $2, $3, $4, $5, $6)';
            await pool.query(query, [this.nome_produto, this.preco, this.categoria_id, this.descricao, this.imagem, this.tempo_preparo]);

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async editarProduto(id, dadosAtualizados) {
        try {
            const produtoExistente = await verificarProdutoPorId(id);

            const camposParaAtualizar = {
                nome_produto: dadosAtualizados.nome_produto || produtoExistente.nome_produto,
                preco: dadosAtualizados.preco || produtoExistente.preco,
                categoria_id: dadosAtualizados.categoria_id || produtoExistente.categoria_id,
                descricao: dadosAtualizados.descricao || produtoExistente.descricao,
                imagem: dadosAtualizados.imagem || produtoExistente.imagem,
                tempo_preparo: dadosAtualizados.tempo_preparo || produtoExistente.tempo_preparo
            };

            if (dadosAtualizados.categoria_id) {
                const categoriaExiste = await verificarCategoriaExistente(camposParaAtualizar.categoria_id);

                console.log(categoriaExiste);
                if (!categoriaExiste) {
                    throw new Error('A categoria especificada não existe.');
                }
            }

            const queryAtualizarProduto = `
                UPDATE produtos
                SET nome_produto = $1, preco = $2, categoria_id = $3, descricao = $4, imagem = $5, tempo_preparo = $6
                WHERE id = $7
            `;
            await pool.query(queryAtualizarProduto, [
                camposParaAtualizar.nome_produto,
                camposParaAtualizar.preco,
                camposParaAtualizar.categoria_id,
                camposParaAtualizar.descricao,
                camposParaAtualizar.imagem,
                camposParaAtualizar.tempo_preparo,
                id
            ]);

            return camposParaAtualizar; 

        } catch (error) {
            throw new Error('Erro ao atualizar o produto: ' + error.message);

        }
    }

    async excluirProduto() {

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

async function verificarProdutoPorId(id) {
    try {
        const queryVerificarProduto = 'SELECT * FROM produtos WHERE id = $1';
        const resultVerificarProduto = await pool.query(queryVerificarProduto, [id]);

        if (resultVerificarProduto.rows.length === 0) {
            throw new Error('Produto não encontrado.');
        }

        return resultVerificarProduto.rows[0];
    } catch (error) {
        throw new Error('Erro ao verificar produto: ' + error.message);
    }
}

module.exports = Produto