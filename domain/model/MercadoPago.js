const axios = require('axios');
require('dotenv').config();

class MercadoPagoAPI {
    constructor() {
        this.accessToken = process.env.YOUR_ACCESS_TOKEN;
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
        this.external_reference = " ";
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
        this.notification_url = "https://www.seuserver.com/notificacoes";
        this.sponsor = {
            id: parseInt(process.env.SPONSOR_ID)
        };
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


// const accessToken = process.env.YOUR_ACCESS_TOKEN;
// console.log(accessToken);

