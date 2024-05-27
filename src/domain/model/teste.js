require('dotenv').config()
const axios = require('axios');
const { MercadoPagoAPI } = require('./MercadoPago');

const user_id = 1795241025
data = {
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "LOJA2",
  "location": {
    "street_number": "1473",
    "street_name": "Avenida Jóquei Clube",
    "city_name": "Teresina",
    "state_name": "Piauí",
    "latitude": -5.074551123313294,
    "longitude": -42.785308937415,
    "reference": "Pão de Queijo"
  },
  "name": "LOJA PIAUÍ"
}

const dataCaixa = {
  "category": 5611203,
  "external_id": "CAIXA1",
  "external_store_id": "LOJA2",
  "fixed_amount": false,
  "name": "CAIXA 1",
  "store_id": "61110307"
}

const pedido = {
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
    "id": 662208785
  },
  "title": "Product order",
  "total_amount": 100
}

async function criarELogLoja() {
  try {
      const criarLoja = await MercadoPagoAPI.APIPost(`users/${user_id}/stores`, data);
      console.log(criarLoja);
  } catch (error) {
      console.error('Erro ao criar loja:', error);
  }
}

async function criarELogCaixa() {
  try {
      const criarCaixa = await MercadoPagoAPI.APIPost(`pos`, dataCaixa);
      console.log(criarCaixa);
  } catch (error) {
      console.error('Erro ao criar loja:', error);
  }
}

async function criarPedido() {
  try {
      const criarPedido = await MercadoPagoAPI.APIPost(`instore/orders/qr/seller/collectors/${user_id}/pos/CAIXA1/qrs`, pedido);
      console.log(criarPedido);
  } catch (error) {
      console.error('Erro ao criar loja:', error);
  }
}

// Chama a função assíncrona
// criarELogLoja();
// criarELogCaixa()
// criarPedido()