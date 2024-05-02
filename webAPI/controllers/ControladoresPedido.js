const Pedido = require("../../domain/model/Pedido");

const fazerPedido = async (req, res) => {
    const { cliente_id, detalhes_pedido } = req.body;

    try {
        const pedido = new Pedido(cliente_id);

        await pedido.adicionarItemPedido(detalhes_pedido);


    console.log(pedido);
        return res.status(200).json({ mensagem: "Pedido feito com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor: " + error.message });
    }
}


module.exports = {
    fazerPedido
}