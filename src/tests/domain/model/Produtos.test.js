const Produto = require('../../../domain/model/Produtos');
const { NotFoundError, ConflictError, ValidationError } = require('../../../domain/validation/validationError');
const pool = require('../../../infrastructure/persistence/Database');

jest.mock('../../../infrastructure/persistence/Database', () => ({
    query: jest.fn(),
}));

describe('Produto', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('adicionarProduto', () => {
        it('deve adicionar um novo produto', async () => {
            const produto = new Produto('Produto Teste', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);
            pool.query
                .mockResolvedValueOnce({ rows: [{ id: 1 }] })
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce();

            const result = await produto.adicionarProduto();

            expect(pool.query).toHaveBeenCalledTimes(3);
            expect(result).toEqual({ success: true, message: 'Produto adicionado com sucesso.' });
        });

        it('deve lançar um erro se a categoria não existir', async () => {
            const produto = new Produto('Produto Teste', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);

            pool.query.mockResolvedValueOnce({ rows: [] });

            await expect(produto.adicionarProduto()).rejects.toThrow(NotFoundError);
        });

        it('deve lançar um erro se o produto já estiver cadastrado', async () => {
            const produto = new Produto('Produto Teste', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);

            pool.query
                .mockResolvedValueOnce({ rows: [{ id: 1 }] })
                .mockResolvedValueOnce({ rows: [{ nome_produto: 'Produto Teste' }] });

            await expect(produto.adicionarProduto()).rejects.toThrow(ConflictError);
        });

        it('deve lançar um erro de validação para dados inválidos', async () => {
            const produto = new Produto('', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);

            await expect(produto.adicionarProduto()).rejects.toThrow(ValidationError);
        });
    });

    describe('editarProduto', () => {
        it('deve editar um produto existente', async () => {
            const produto = new Produto('Produto Teste', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);
            const id = 1;
            const dadosAtualizados = { nome_produto: 'Novo Nome' };

            pool.query
                .mockResolvedValueOnce({ rows: [{ id, nome_produto: 'Produto Teste' }] })
                .mockResolvedValueOnce();

            const result = await produto.editarProduto(id, dadosAtualizados);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result.nome_produto).toBe('Novo Nome');
        });

        it('deve lançar um erro se o produto não for encontrado', async () => {
            const produto = new Produto('Produto Teste', 1099, 1, 'Descrição teste', 'https://exemplo.com/imagem/produto_teste.jpg', 5);
            const id = 1;
            const dadosAtualizados = { nome_produto: 'Novo Nome' };

            pool.query.mockResolvedValueOnce({ rows: [] });

            await expect(produto.editarProduto(id, dadosAtualizados)).rejects.toThrow(NotFoundError);
        });
    });

    describe('excluirProduto', () => {
        it('deve excluir um produto existente', async () => {
            const produto = new Produto();
            const id = 1;

            pool.query
                .mockResolvedValueOnce({ rows: [{ id }] })
                .mockResolvedValueOnce();

            const result = await produto.excluirProduto(id);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ success: true, message: 'Produto excluído com sucesso.' });
        });

        it('deve lançar um erro se o produto não for encontrado', async () => {
            const produto = new Produto();
            const id = 1;

            pool.query.mockResolvedValueOnce({ rows: [] });

            await expect(produto.excluirProduto(id)).rejects.toThrow(NotFoundError);
        });
    });


    describe('listarProdutosPorCategoria', () => {
        it('deve listar produtos de uma categoria existente', async () => {
            const produto = new Produto();
            const categoriaId = 1;
            pool.query.mockResolvedValueOnce({ rows: [{ nome_produto: 'Produto 1' }, { nome_produto: 'Produto 2' }] });

            const result = await produto.listarProdutosPorCategoria(categoriaId);

            expect(pool.query).toHaveBeenCalled();
            expect(result.length).toBe(2);
        });
    });
});