# Minha Aplicação

Bem-vindo à aplicação de Gerenciamento de Pedidos e Clientes!

## Descrição

Minha aplicação é uma API para gerenciamento de pedidos e clientes. Com ela, você pode controlar todos os aspectos do seu negócio, desde o cadastro de clientes até a realização e acompanhamento de pedidos.

## Objetivos

O principal objetivo da aplicação é proporcionar uma experiência de gerenciamento de pedidos e clientes de forma eficiente e intuitiva. Alguns objetivos específicos incluem:

- Facilitar o processo de cadastro e identificação de clientes.
- Simplificar a realização e acompanhamento de pedidos, incluindo recursos como listagem de produtos por categoria e estimativa de tempo de entrega.
- Oferecer um painel administrativo completo para gerenciar clientes e produtos, permitindo adicionar, editar e excluir informações.
- Integrar um sistema de pagamento via QR code do Mercado Pago para facilitar transações seguras.

## Como Iniciar o Projeto Localmente

Siga as instruções abaixo para iniciar o projeto localmente em seu ambiente de desenvolvimento:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- Node.js
- Docker
- Docker Compose

### Passos de Configuração

1. Clone o repositório para o seu ambiente local:

   ```bash
   git clone https://github.com/seu-usuario/minha-aplicacao.git
   cd minha-aplicacao

2. Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

    POSTGRES_USER=seu_usuario
    POSTGRES_PASSWORD=sua_senha
    POSTGRES_DB=seu_banco_de_dados
    DB_HOST=database

3. Certifique-se de que o arquivo .env está no .gitignore para não versionar suas credenciais:

    .gitignore
    .env

### Iniciando o Projeto

Para iniciar a aplicação, execute o seguinte comando:

    docker-compose up --build

Isso construirá as imagens Docker necessárias e iniciará os serviços.

### Acessando a Aplicação

Uma vez que a aplicação esteja rodando, você pode acessá-la em:

http://localhost:3000

### Parando o Projeto

Para parar a execução da aplicação, pressione Ctrl + C no terminal onde o Docker Compose está rodando.

## Contribuição

Se você quiser contribuir com este projeto, por favor, siga as etapas abaixo:

1. Faça um fork do repositório.
2. Crie uma nova branch (git checkout -b feature/nova-feature).
3. Faça commit de suas mudanças (git commit -am 'Adiciona nova feature').
4. Envie para o repositório remoto (git push origin feature/nova-feature).
5. Crie um novo Pull Request.
