const axios = require('axios');

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

const mercadopago = new MercadoPagoAPI()

module.exports = mercadopago