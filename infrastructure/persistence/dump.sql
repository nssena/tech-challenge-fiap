CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    preco INT NOT NULL,
    categoria_id INT NOT NULL,
  	descricao TEXT, 
    imagem VARCHAR(255),
 	tempo_preparo INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE pedidos (
    pedido_id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    preco_total INT NOT NULL,
  	pagamento BOOLEAN NOT NULL DEFAULT false,
  	external_reference VARCHAR(255) NOT NULL,
  	tempo_estimado_entrega INT NOT NULL,
  	status_pedido VARCHAR(50) NOT NULL DEFAULT 'em andamento',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE pedido_detalhado (
    pedido_detalhado_id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    nome_produto VARCHAR(100) NOT NULL, 
    preco INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id)
);