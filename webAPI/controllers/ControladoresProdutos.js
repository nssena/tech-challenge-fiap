const Produto = require("../../domain/model/Produtos");

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

        await produto.adicionarProduto();

        return res.status(200).json({ mensagem: 'Produto adicionado com sucesso.' });

    } catch (error) {
        return res.status(500).json({ mensagem:  error.message });

    }
}

const editarProduto = async (req, res) => {
    const id = Number(req.params.id);
    const dadosAtualizados = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const produto = new Produto(dadosAtualizados);
        const produtoEditado = await produto.editarProduto(id, dadosAtualizados);

        res.json({ message: 'Produto atualizado com sucesso' });

    } catch (error) {
        return res.status(500).json({ mensagem:  error.message });

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
        res.status(500).json({ error: error.message });
    }
}



const listarProdutosCategoria = async (req, res) => {
    const categoriaId = req.params.categoria_id;

    try {
        const produto = new Produto();
        const produtosPorCategoria = await produto.listarProdutosPorCategoria(categoriaId);

        res.status(200).json(produtosPorCategoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    usuarioAutenticado,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    listarProdutosCategoria
}