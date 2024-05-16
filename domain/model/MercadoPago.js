const axios = require('axios');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');


class MercadoPagoAPI {
    constructor() {
        this.accessToken = "TEST-5964076815976378-051520-8a77a9bead5df7df19b07595bfdef256-1795241025";
        this.baseURL = 'https://api.mercadopago.com';
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        };
    }

    async APIGet(endpoint) {
        try {
            const response = await axios.get(`${this.baseURL}/${endpoint}`, { headers: this.headers });
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao fazer o GET: ${error.response.data.message}`);
        }
    }

    async APIPost(endpoint, data) {
        try {
            const response = await axios.post(`${this.baseURL}/${endpoint}`, data, { headers: this.headers });
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao fazer o POST: ${error.response.data.message}`);
        }
    }

    async APIPut(endpoint, data) {
        try {
            const response = await axios.put(`${this.baseURL}/${endpoint}`, data, { headers: this.headers });
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao fazer o PUT: ${error.response.data.message}`);
        }
    }

    async APIDelete(endpoint) {
        try {
            const response = await axios.delete(`${this.baseURL}/${endpoint}`, { headers: this.headers });
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao fazer o DELETE: ${error.response.data.message}`);
        }
    }
}


class QrCode {
    constructor(detalhes_pedido) {
        this.cash_out = {
            amount: 0
        };
        this.description = " ";
        this.external_reference = uuidv4();
        this.items = detalhes_pedido.map(item => ({
            sku_number: (item.produto_id).toString(),
            category: " ",
            title: " ",
            description: " ",
            unit_price: item.preco / 100,
            quantity: item.quantidade,
            unit_measure: " ",
            total_amount: (item.preco / 100) * item.quantidade
        }));
        this.notification_url = "https://webhook-test.com/d4b4dfdd95ca464d884e67736ddc09ab";
        this.title = "Pedido de Produto";
        this.total_amount = this.calcularTotal(detalhes_pedido);
    }

    calcularTotal(detalhes_pedido) {
        let totalCentavos = 0;
        for (const item of detalhes_pedido) {
            totalCentavos += item.preco * item.quantidade;
        }

        const totalReais = totalCentavos /100
            return totalReais;
    }

    toJSON() {
        return {
            cash_out: this.cash_out,
            description: this.description,
            external_reference: this.external_reference,
            items: this.items,
            notification_url: this.notification_url,
            sponsor: this.sponsor,
            title: this.title,
            total_amount: this.total_amount
        };
    }
}


module.exports = {
    MercadoPagoAPI: new MercadoPagoAPI(),
    QrCode: QrCode
};
