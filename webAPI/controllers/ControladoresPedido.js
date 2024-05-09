const Pedido = require("../../domain/model/Pedido");


const fazerPedido = async (req, res) => {
    const { cliente_id, detalhes_pedido } = req.body;

    try {
// Chegar ao valor total do pedido
        let totalPedido = 0;


        for (const item of detalhes_pedido) {
            totalPedido += item.preco * item.quantidade;
        }

        const dadosQrCode = {
            "cash_out": {
              "amount": 0
            },
            "description": "Purchase description.",
            "external_reference": "reference_12345",
            "items": [
              {
                "sku_number": "A123K9191938",
                "category": "marketplace",
                "title": "Point Mini",
                "description": "This is the Point Mini",
                "unit_price": 100,
                "quantity": 1,
                "unit_measure": "unit",
                "total_amount": 100
              }
            ],
            "notification_url": "https://www.yourserver.com/notifications",
            "sponsor": {
              "id": 84774673

            },
            "title": "Product order",
            "total_amount": 100
          };
  

        const pedido = new Pedido(cliente_id);

        await pedido.adicionarItemPedido(detalhes_pedido);

        await pedido.gerarQRCode(dadosQrCode);
        
        return res.status(200).json({ mensagem: "Pedido feito com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor: " + error.message });
    }
}

const finalizarPedido = async (req, res) => {
    const { cliente_id, detalhes_pedido } = req.body;
    try {
        const pedido = new Pedido(cliente_id);

        console.log(pedido);

        await pedido.enviarPedidosParaBancoDeDados(detalhes_pedido);

        res.status(200).json({ mensagem: 'Pedidos enviados para o banco de dados com sucesso.' });
    } catch (error) {
        // Responda ao cliente com uma mensagem de erro em caso de falha
        res.status(500).json({ erro: error.message });
    }
};


module.exports = {
    fazerPedido,
    finalizarPedido
}