const { schemaDetalhesPedido } = require("../validation/schemas");
const pool = require('../../infrastructure/persistence/Database');
const { MercadoPagoAPI, QrCode } = require("./MercadoPago");
require('dotenv').config(); 

class Pedido {
    constructor(client_id) {
        this.client_id = client_id;
        this.pedidos = [];
        this.pedidosEnviados = [];
    }

    async adicionarItemPedido(detalhes_pedido) {
        try {
            await schemaDetalhesPedido.validateAsync(detalhes_pedido);

            for (const itemPedido of detalhes_pedido) {
                const produtoExistenteIndex = this.pedidos.findIndex(pedido => pedido.produto_id === itemPedido.produto_id);

                if (produtoExistenteIndex !== -1) {
                    this.pedidos[produtoExistenteIndex].quantidade += itemPedido.quantidade;
                } else {
                    this.pedidos.push(itemPedido);
                }
            }

        } catch (error) {
            throw new Error('Erro ao adicionar item ao pedido: ' + error.message);
        }
    }

    async gerarQRCode(detalhes_pedido) {
        const user_id = process.env.USER_ID;
        const external_pos_id = process.env.EXTERNAL_POS_ID;

        const dadosQrCode = new QrCode(detalhes_pedido).toJSON()

        const apiUrl = `instore/orders/qr/seller/collectors/${user_id}/pos/${external_pos_id}/qrs`;

        const resposta = await MercadoPagoAPI.APIPost(apiUrl,dadosQrCode)

        console.log(resposta);

        return resposta;
    }

    async enviarPedidosParaBancoDeDados() {
        try {
            for (const pedido of this.pedidos) {
                console.log(this.pedidos);
                // Inserir pedido na tabela pedidos
                const preco_total = pedido.preco * pedido.quantidade;
                const queryPedido = 'INSERT INTO pedidos (cliente_id, preco_total) VALUES ($1, $2) RETURNING pedido_id';
                const pedidoResult = await pool.query(queryPedido, [this.client_id, preco_total]);
                const pedido_id = pedidoResult.rows[0].pedido_id;


                // Inserir detalhes do pedido na tabela pedido_detalhado
                const queryDetalhesPedido = 'INSERT INTO pedido_detalhado (pedido_id, produto_id, preco, quantidade) VALUES ($1, $2, $3, $4)';
                await pool.query(queryDetalhesPedido, [pedido_id, pedido.produto_id, pedido.preco, pedido.quantidade]);

                // Adicionar o pedido enviado à lista de pedidos enviados
                this.pedidosEnviados.push(pedido);
            }
            // Limpar a lista de pedidos após enviá-los para o banco de dados
            this.pedidos = [];

        } catch (error) {
            throw new Error('Erro ao enviar pedidos para o banco de dados: ' + error.message);
        }
    }
}


module.exports = Pedido;
