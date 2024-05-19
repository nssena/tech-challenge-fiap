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

        const dadosQrCode = new QrCode(detalhes_pedido);
        const qrCodeJSON = dadosQrCode.toJSON();
        // Inserir pedido na tabela pedidos

        const queryPedido = 'INSERT INTO pedidos (cliente_id, preco_total, external_reference) VALUES ($1, $2, $3) RETURNING pedido_id';
        const pedidoResult = await pool.query(queryPedido, [this.client_id, qrCodeJSON.total_amount * 100, qrCodeJSON.external_reference]);

        const pedido_id = pedidoResult.rows[0].pedido_id;

        for (const detalhe_pedido of detalhes_pedido) {
            const queryNomeProduto = 'SELECT nome_produto FROM produtos WHERE id = $1';
            const nomeProdutoResult = await pool.query(queryNomeProduto, [detalhe_pedido.produto_id]);
            const nome_produto = nomeProdutoResult.rows[0].nome_produto;
            console.log(nome_produto);

            // Inserir detalhes do pedido na tabela pedido_detalhado
            const queryDetalhesPedido = 'INSERT INTO pedido_detalhado (pedido_id, nome_produto, preco, quantidade) VALUES ($1, $2, $3, $4)';
            await pool.query(queryDetalhesPedido, [pedido_id, nome_produto, detalhe_pedido.preco, detalhe_pedido.quantidade]);

            // Adicionar o detalhe do pedido à lista de pedidos enviados
            this.pedidosEnviados.push(detalhe_pedido);
        }

        const apiUrl = `instore/orders/qr/seller/collectors/${user_id}/pos/${external_pos_id}/qrs`;
        const resposta = await MercadoPagoAPI.APIPost(apiUrl, qrCodeJSON);

        return resposta;
    }
}


module.exports = Pedido