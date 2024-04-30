const { schemaPedidoDetalhado } = require("../validation/schemas");

class Pedido {
    constructor(cliente_id, preco_total) {
        this.cliente_id = cliente_id;
        this.preco_total = preco_total;
        this.itens = [];
    }

    async adicionarItem(nome_produto, preco, quantidade) {
        try {
            const { error } = schemaPedidoDetalhado.validate({
                pedido_id: this.pedido_id,
                nome_produto: nome_produto,
                preco: preco,
                quantidade: quantidade
            });

            if (error) {
                throw new Error(error.details[0].message);
            }

            this.itens.push({
                pedido_id: this.pedido_id,
                nome_produto: nome_produto,
                preco: preco,
                quantidade: quantidade
            });
            return 'Item adicionado ao pedido com sucesso.';
        } catch (error) {
            throw new Error('Erro ao adicionar item ao pedido: ' + error.message);
        }
    }

    async salvarPedido() {
        try {
            const { error } = schemaPedido.validate({
                cliente_id: this.cliente_id,
                preco_total: this.preco_total
            });

            if (error) {
                throw new Error(error.details[0].message);
            }

            const query = 'insert into pedidos (cliente_id, preco_total) values ($1, $2)';
            await pool.query(query, [this.cliente_id, this.preco_total]);
        } catch (error) {
            throw new Error('Erro ao salvar pedido no banco de dados: ' + error.message);
        }
    }
}

module.exports = Pedido