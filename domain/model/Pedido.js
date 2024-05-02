const { schemaItemPedido } = require("../validation/schemas");

class Pedido {
    constructor(client_id) {
        this.client_id = client_id;
        this.pedidos = [];
    }

    async adicionarItemPedido(itemPedido) {
        try {
            // Validar o item do pedido
            await schemaItemPedido.validateAsync(itemPedido);
            
            //A validação tá deixando passar uma array vazia

            // Verificar se o nome do produto já existe na lista de pedidos
            const produtoExistenteIndex = this.pedidos.findIndex(pedido => pedido.nome_produto === itemPedido.nome_produto);

            if (produtoExistenteIndex !== -1) {
                // Se o produto já existir, adicionar a quantidade
                this.pedidos[produtoExistenteIndex].quantidade += itemPedido.quantidade;
            } else {
                // Se não existir, adicionar como um novo item de pedido
                this.pedidos.push(itemPedido);
            }

        } catch (error) {
            throw new Error('Erro ao adicionar item ao pedido: ' + error.message);
        }
    }

    // calcularPrecoTotal() {
    //     return this.detalhes_pedido.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    // }

    // async salvarPedido() {
    //     try {
    //         const preco_total = this.calcularPrecoTotal();

    //         const query = 'insert into pedidos (cliente_id, preco_total) values ($1, $2) RETURNING pedido_id';
    //         const result = await pool.query(query, [this.cliente_id, preco_total]);
    //         const pedido_id = result.rows[0].pedido_id;

    //         const detalhes_query = 'insert into pedido_detalhado (pedido_id, nome_produto, preco, quantidade) values ($1, $2, $3, $4)';
    //         for (const item of this.detalhes_pedido) {
    //             await pool.query(detalhes_query, [pedido_id, item.nome_produto, item.preco, item.quantidade]);
    //         }
    //     } catch (error) {
    //         throw new Error('Erro ao salvar pedido no banco de dados: ' + error.message);
    //     }
    // }
}

module.exports = Pedido;