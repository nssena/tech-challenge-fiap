const Pedido = require('../../../domain/model/Pedido');
const { NotFoundError } = require('../../../domain/validation/validationError');
const { MercadoPagoAPI } = require('../../../domain/model/MercadoPago');


jest.mock('../../../infrastructure/persistence/Database', () => ({
    query: jest.fn(),
}));

jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

describe('Pedido', () => {
    describe('adicionarItemPedido', () => {
        it('deve adicionar um item ao pedido', async () => {
            const pedido = new Pedido(1);
            const detalhes_pedido = [{ produto_id: 1, preco: 399, quantidade: 2 }];

            const mockValidateAsync = jest.fn().mockResolvedValue();
            const mockSchemaDetalhesPedido = { validateAsync: mockValidateAsync };
            jest.mock('../../../domain/validation/schemas', () => ({
                schemaDetalhesPedido: mockSchemaDetalhesPedido,
            }));

            const mockQuery = jest.fn().mockResolvedValue({ rows: [{ tempo_preparo: 10 }] });
            require('../../../infrastructure/persistence/Database').query.mockImplementation(mockQuery);

            await pedido.adicionarItemPedido(detalhes_pedido);

            expect(pedido.pedidos.length).toBe(1);
            expect(pedido.pedidos[0]).toEqual(detalhes_pedido[0]);
        });

        it('deve lançar um erro se o produto não for encontrado', async () => {
            const pedido = new Pedido(1);
            const detalhes_pedido = [{ produto_id: 1, preco: 399, quantidade: 2 }];

            const mockValidateAsync = jest.fn().mockResolvedValue();
            const mockSchemaDetalhesPedido = { validateAsync: mockValidateAsync };
            jest.mock('../../../domain/validation/schemas', () => ({
                schemaDetalhesPedido: mockSchemaDetalhesPedido,
            }));

            const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
            require('../../../infrastructure/persistence/Database').query.mockImplementation(mockQuery);

            await expect(pedido.adicionarItemPedido(detalhes_pedido)).rejects.toThrow(NotFoundError);
        });
    });

    describe('gerarQRCode', () => {
        it('deve gerar um QR code', async () => {
            const pedido = new Pedido(1);
            const detalhes_pedido = [{ produto_id: 1, preco: 10, quantidade: 2 }];

            const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [{ pedido_id: 1 }] })
                .mockResolvedValueOnce({ rows: [{ nome_produto: 'Produto 1' }] });
            require('../../../infrastructure/persistence/Database').query.mockImplementation(mockQuery);

            const mockAPIPost = jest.fn().mockResolvedValue('resposta');
            MercadoPagoAPI.APIPost = mockAPIPost;

            const resposta = await pedido.gerarQRCode(detalhes_pedido);

            expect(resposta).toBe('resposta');
        });
    });
});
