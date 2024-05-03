const Produto = require("../../domain/model/Produtos");


const adicionarProduto = async (req, res) => {
    const { nome_produto, preco, categoria_id, descricao, imagem } = req.body;

    try {
        const produto = new Produto(nome_produto, preco, categoria_id, descricao, imagem);

        await produto.adicionarProduto();

        return res.status(200).json({ mensagem: 'Produto adicionado com sucesso.' });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao adicionar produto: ' + error.message });

    }
}

module.exports = {
    adicionarProduto
}