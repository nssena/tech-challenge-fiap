const { schemaPedidoCompleto } = require("../validation/schemas");

class Pedido {
    constructor(cliente_id, detalhes_pedido) {
        this.cliente_id = cliente_id;
        this.detalhes_pedido = detalhes_pedido;
    }

    async adicionarItem(nome_produto, preco, quantidade) {
        try {
            const { error } = schemaPedidoCompleto.validate({
                cliente_id: this.cliente_id,
                detalhes_pedido: this.detalhes_pedido
            });
            
            if (error) {
                throw new Error(error.details[0].message);
            }
            
            //Só se houver mais de um objeto na array de detalhes_pedido
            this.detalhes_pedido.push({
                nome_produto: nome_produto,
                preco: preco,
                quantidade: quantidade
            });

        } catch (error) {
            throw new Error('Erro ao adicionar item ao pedido: ' + error.message);
        }
    }

    calcularPrecoTotal() {
        return this.detalhes_pedido.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    async salvarPedido() {
        try {
            const preco_total = this.calcularPrecoTotal();

            const query = 'insert into pedidos (cliente_id, preco_total) values ($1, $2) RETURNING pedido_id';
            const result = await pool.query(query, [this.cliente_id, preco_total]);
            const pedido_id = result.rows[0].pedido_id;

            const detalhes_query = 'insert into pedido_detalhado (pedido_id, nome_produto, preco, quantidade) values ($1, $2, $3, $4)';
            for (const item of this.detalhes_pedido) {
                await pool.query(detalhes_query, [pedido_id, item.nome_produto, item.preco, item.quantidade]);
            }
        } catch (error) {
            throw new Error('Erro ao salvar pedido no banco de dados: ' + error.message);
        }
    }
}

module.exports = Pedido;