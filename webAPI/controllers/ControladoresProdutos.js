const Produto = require("../../domain/model/Produtos");


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
    const produto = req.params;

    try {

    } catch (error) {

    }
}

const produtosCategoria = async (req, res) => {

}

module.exports = {
    adicionarProduto,
    editarProduto,
    excluirProduto
}