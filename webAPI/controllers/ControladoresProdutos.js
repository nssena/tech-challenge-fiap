const Produto = require("../../domain/model/Produtos");
const { ValidationError, NotFoundError, ConflictError } = require("../../domain/validation/validationError");

//Token para validar as rotas
const tokenAutenticacao = 'admin';

const usuarioAutenticado = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token && token === tokenAutenticacao) {
        return next();
    }
    res.status(401).json({ message: 'Você precisa estar autenticado para acessar esta rota' });
}


const adicionarProduto = async (req, res) => {
    const { nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo } = req.body;

    try {
        const produto = new Produto(nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo);

        const adicionarProduto = await produto.adicionarProduto();

        return res.status(200).json({ mensagem: adicionarProduto.message });

    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ mensagem: error.message });
        }
        if (error instanceof NotFoundError) {
            return res.status(404).json({ mensagem: error.message });
        }

        if (error instanceof ConflictError) {
            return res.status(409).json({ mensagem: error.message });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const editarProduto = async (req, res) => {
    const id = Number(req.params.id);
    const dadosAtualizados = req.body;

    if (isNaN(id)) {
        throw new ValidationError('ID inválido');
    }

    try {
        const produto = new Produto(dadosAtualizados);
        const resultado = await produto.editarProduto(id, dadosAtualizados);

        res.json({ message: 'Produto atualizado com sucesso' });

    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });

    }
}

const excluirProduto = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const produto = new Produto();
        await produto.excluirProduto(id);

        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {

        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });

    }
}

const listarProdutosCategoria = async (req, res) => {
    const categoriaId = req.params.categoria_id;

    if (isNaN(categoriaId) || categoriaId <= 0) {
        return res.status(400).json({ error: 'ID da categoria inválido' });
    }

    try {
        const produto = new Produto();
        const produtosPorCategoria = await produto.listarProdutosPorCategoria(categoriaId);

        res.status(200).json(produtosPorCategoria);
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}


module.exports = {
    usuarioAutenticado,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    listarProdutosCategoria
}