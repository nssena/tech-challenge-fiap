const pool = require("../../infrastructure/persistence/Database");
const { schemaProduto, schemaEdicaoProduto } = require("../validation/schemas");
const { NotFoundError, ConflictError, ValidationError } = require("../validation/validationError");

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
                throw new ValidationError(error.details[0].message);
            }

            const categoriaExiste = await verificarCategoriaExistente(this.categoria_id);
            if (!categoriaExiste) {
                throw new NotFoundError('A categoria especificada não existe.');
            }

            const produtoCadastrado = await verificarProdutoCadastrado(this.nome_produto);
            if (produtoCadastrado) {
                throw new ConflictError('Este produto já foi cadastrado anteriormente.');
            }

            const query = 'insert into produtos (nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo) values ($1, $2, $3, $4, $5, $6)';
            await pool.query(query, [this.nome_produto, this.preco, this.categoria_id, this.descricao, this.imagem, this.tempo_preparo]);

            return { success: true, message: 'Produto adicionado com sucesso.' };

        } catch (error) {
            throw error
        }
    }

    async editarProduto(id, dadosAtualizados) {
        try {

            const produtoExistente = await verificarProdutoPorId(id);
            if (!produtoExistente) {
                throw new NotFoundError('Produto não encontrado.');
            }

            const camposParaAtualizar = {
                nome_produto: dadosAtualizados.nome_produto || produtoExistente.nome_produto,
                preco: dadosAtualizados.preco || produtoExistente.preco,
                categoria_id: dadosAtualizados.categoria_id || produtoExistente.categoria_id,
                descricao: dadosAtualizados.descricao || produtoExistente.descricao,
                imagem: dadosAtualizados.imagem || produtoExistente.imagem,
                tempo_preparo: dadosAtualizados.tempo_preparo || produtoExistente.tempo_preparo
            };

            const { error } = schemaEdicaoProduto.validate(camposParaAtualizar);
            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            if (dadosAtualizados.categoria_id) {
                const categoriaExiste = await verificarCategoriaExistente(camposParaAtualizar.categoria_id);

                if (!categoriaExiste) {
                    throw new NotFoundError('A categoria especificada não existe.');
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
            if (error instanceof ValidationError) {
                throw error;
            } else if (error instanceof NotFoundError) {
                throw error;
            } else {
                throw new Error('Erro ao atualizar o produto: ' + error.message);
            }
        }
    }

    async excluirProduto(id) {
        try {
            const produtoExistente = await verificarProdutoPorId(id);
            if (!produtoExistente) {
                throw new NotFoundError('Produto não encontrado.');
            }

            const queryDeletarProduto = `DELETE FROM produtos WHERE id = $1`;
            await pool.query(queryDeletarProduto, [id])

            return { success: true, message: 'Produto excluído com sucesso.' };

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            } else {
                throw new Error('Erro ao excluir o produto: ' + error.message);
            }
        }
    }

    async listarProdutosPorCategoria(categoriaId) {
        try {

            if (isNaN(categoriaId) || categoriaId <= 0) {
                throw new ValidationError('ID da categoria inválido.');
            }

            const queryListarProdutos = 'SELECT * FROM produtos WHERE categoria_id = $1';
            const resultado = await pool.query(queryListarProdutos, [categoriaId]);

            if (resultado.rows.length === 0) {
                throw new NotFoundError('Nenhum produto encontrado para esta categoria.');
            }

            return resultado.rows;
        } catch (error) {
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            } else {
                throw new Error('Erro ao listar produtos por categoria: ' + error.message);
            }
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

async function verificarProdutoPorId(id) {
    try {
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('ID inválido.');
        }

        const queryVerificarProduto = 'SELECT * FROM produtos WHERE id = $1';
        const resultVerificarProduto = await pool.query(queryVerificarProduto, [id]);

        if (resultVerificarProduto.rows.length === 0) {
            throw new NotFoundError('Produto não encontrado.');
        }

        return resultVerificarProduto.rows[0];
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            throw error;
        } else {
            throw new Error('Erro ao verificar produto: ' + error.message);
        }
    }
}

module.exports = Produto