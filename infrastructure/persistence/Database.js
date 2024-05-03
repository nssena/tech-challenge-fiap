const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1574',
    database: 'tech_challenge_fiap'
})

module.exports = pool


// CREATE TABLE clientes (
//     cliente_id SERIAL PRIMARY KEY,
//     nome VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     cpf VARCHAR(11) NOT NULL UNIQUE,
//     criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE pedidos (
//     pedido_id SERIAL PRIMARY KEY,
//     cliente_id INT NOT NULL,
//     preco_total DECIMAL(10, 2) NOT NULL CHECK (preco_total > 0),
//     criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
// );

// CREATE TABLE pedido_detalhado (
//     pedido_detalhado_id SERIAL PRIMARY KEY,
//     pedido_id INT NOT NULL,
//     nome_produto VARCHAR(100) NOT NULL,
//     preco DECIMAL(10, 2) NOT NULL CHECK (preco > 0),
//     quantidade INT NOT NULL CHECK (quantidade > 0),
//     FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id)
// );

// CREATE TABLE categorias (
//     id SERIAL PRIMARY KEY,
//     nome_categoria VARCHAR(100) NOT NULL
// );

// CREATE TABLE produtos (
//     id SERIAL PRIMARY KEY,
//     nome_produto VARCHAR(100) NOT NULL,
//     preco DECIMAL(10, 2) NOT NULL,
//     categoria_id INT NOT NULL,
//     descricao TEXT,
//     imagem VARCHAR(255),
//     FOREIGN KEY (categoria_id) REFERENCES categorias(id)
// );