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

INSERT INTO categorias (nome_categoria) VALUES
    ('Lanche'),
    ('Acompanhamento'),
    ('Bebida'),
    ('Sobremesa');


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

INSERT INTO produtos (nome_produto, preco, categoria_id, descricao, imagem, tempo_preparo) VALUES
    ('Hambúrguer Clássico', 2500, 1, 'Hambúrguer com carne bovina, alface, tomate e queijo.', 'hamburguer_classico.jpg', 15),
    ('Cheeseburger', 2800, 1, 'Hambúrguer com carne bovina, queijo cheddar e bacon.', 'cheeseburger.jpg', 20),
    ('Sanduíche de Frango', 2200, 1, 'Sanduíche com peito de frango grelhado, alface e maionese.', 'sanduiche_frango.jpg', 18),
    ('Wrap Vegetariano', 2000, 1, 'Wrap com legumes grelhados, homus e alface.', 'wrap_vegetariano.jpg', 12),
    ('Hot Dog', 1800, 1, 'Cachorro-quente com salsicha, mostarda e ketchup.', 'hot_dog.jpg', 10),
    ('Batata Frita', 1000, 2, 'Porção de batata frita crocante.', 'batata_frita.jpg', 8),
    ('Onion Rings', 1200, 2, 'Anéis de cebola empanados e fritos.', 'onion_rings.jpg', 10),
    ('Salada Verde', 1500, 2, 'Salada de folhas verdes com molho especial.', 'salada_verde.jpg', 5),
    ('Chicken Nuggets', 1500, 2, 'Porção de nuggets de frango.', 'chicken_nuggets.jpg', 12),
    ('Palitos de Queijo', 1200, 2, 'Palitos de queijo empanados e fritos.', 'palitos_queijo.jpg', 10),
    ('Refrigerante', 500, 3, 'Lata de refrigerante 350ml.', 'refrigerante.jpg', 2),
    ('Suco Natural', 700, 3, 'Copo de suco natural de laranja.', 'suco_natural.jpg', 3),
    ('Água Mineral', 300, 3, 'Garrafa de água mineral 500ml.', 'agua_mineral.jpg', 1),
    ('Milkshake de Chocolate', 1500, 3, 'Milkshake cremoso de chocolate.', 'milkshake_chocolate.jpg', 5),
    ('Café Expresso', 600, 3, 'Café expresso quente.', 'cafe_expresso.jpg', 3),
    ('Sorvete', 1000, 4, 'Porção de sorvete de baunilha.', 'sorvete.jpg', 5),
    ('Brownie', 1200, 4, 'Brownie de chocolate com nozes.', 'brownie.jpg', 8),
    ('Torta de Limão', 1400, 4, 'Torta de limão com merengue.', 'torta_limao.jpg', 10),
    ('Cheesecake', 1500, 4, 'Cheesecake de frutas vermelhas.', 'cheesecake.jpg', 12),
    ('Petit Gateau', 1800, 4, 'Bolo quente de chocolate com sorvete.', 'petit_gateau.jpg', 12);

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
