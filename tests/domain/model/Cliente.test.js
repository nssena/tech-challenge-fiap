const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../../../infrastructure/persistence/Database');
const Cliente = require('../../../domain/model/Cliente');
const { schemaCliente, schemaCPF } = require('../../../domain/validation/schemas');

jest.mock('crypto');
jest.mock('jsonwebtoken');
jest.mock('../../../infrastructure/persistence/Database');
jest.mock('../../../domain/validation/schemas', () => ({
    schemaCliente: {
        validate: jest.fn(),
    },
    schemaCPF: {
        validate: jest.fn(),
    },
}));

describe('Cliente', () => {
    const nome = 'Usuário Teste';
    const email = 'teste@example.com';
    const cpf = '12345678901';

    describe('cadastrar', () => {
        it('deve retornar true quando o cliente é cadastrado com sucesso', async () => {
            schemaCliente.validate.mockReturnValue({ error: null });
            pool.query.mockResolvedValue({ rowCount: 1 });
        
            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();
        
            expect(result).toBe(true);
        });
        
        it('deve retornar um objeto de erro quando houver falha no cadastro do cliente', async () => {
            schemaCliente.validate.mockReturnValue({ error: null });
            pool.query.mockResolvedValue({ rowCount: 0 });
        
            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();
        
            expect(result).toBe(false);
        });

        it('deve retornar erro quando a validação falha', async () => {
            schemaCliente.validate.mockReturnValue({ error: { details: [{ message: 'Erro de validação' }] } });

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();

            expect(result).toEqual({ error: 'Erro ao cadastrar cliente: Erro de validação' });
        });

        it('deve retornar erro quando o email já existe', async () => {
            schemaCliente.validate.mockReturnValue({ error: null });
            pool.query.mockResolvedValueOnce({ rows: [{}] }); // Email existe

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();

            expect(result).toEqual({ error: 'Erro ao cadastrar cliente: Cliente já cadastrado' });
        });

        it('deve retornar erro quando o cpf já existe', async () => {
            schemaCliente.validate.mockReturnValue({ error: null });
            pool.query
                .mockResolvedValueOnce({ rows: [] }) 
                .mockResolvedValueOnce({ rows: [{}] }); 

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();

            expect(result).toEqual({ error: 'Erro ao cadastrar cliente: Cliente já cadastrado' });
        });

        it('deve retornar erro em caso de erro no banco de dados', async () => {
            schemaCliente.validate.mockReturnValue({ error: null });
            pool.query.mockRejectedValue(new Error('Erro no banco de dados'));

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.cadastrar();

            expect(result).toEqual({ error: 'Erro ao cadastrar cliente: Erro no banco de dados' });
        });
    });

    describe('identificar', () => {
        it('deve retornar token quando o cpf é encontrado', async () => {
            schemaCPF.validate.mockReturnValue({ error: null });
            pool.query.mockResolvedValue({ rows: [{}] });

            const token = 'fakeToken';
            jwt.sign.mockReturnValue(token);
            crypto.randomBytes.mockReturnValue(Buffer.from('fakeKey'));

            const cliente = new Cliente(undefined, undefined, cpf);
            const result = await cliente.identificar();

            expect(result).toBe(token);
        });

        it('deve lançar erro quando a validação falha', async () => {
            schemaCPF.validate.mockReturnValue({ error: { details: [{ message: 'Erro de validação' }] } });

            const cliente = new Cliente(undefined, undefined, cpf);
            await expect(cliente.identificar()).rejects.toThrow('Erro interno do servidor.');
        });

        it('deve lançar erro quando o cpf não é encontrado', async () => {
            schemaCPF.validate.mockReturnValue({ error: null });
            pool.query.mockResolvedValue({ rows: [] });

            const cliente = new Cliente(undefined, undefined, cpf);
            await expect(cliente.identificar()).rejects.toThrow('Erro interno do servidor.');
        });
    });

    describe('verificarEmailExistente', () => {
        it('deve retornar true quando o email existe', async () => {
            pool.query.mockResolvedValue({ rows: [{}] });

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.verificarEmailExistente();

            expect(result).toBe(true);
        });

        it('deve retornar false quando o email não existe', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.verificarEmailExistente();

            expect(result).toBe(false);
        });
    });

    describe('verificarCpfExistente', () => {
        it('deve retornar true quando o cpf existe', async () => {
            pool.query.mockResolvedValue({ rows: [{}] });

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.verificarCpfExistente();

            expect(result).toBe(true);
        });

        it('deve retornar false quando o cpf não existe', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const cliente = new Cliente(nome, email, cpf);
            const result = await cliente.verificarCpfExistente();

            expect(result).toBe(false);
        });
    });

    describe('gerarToken', () => {
        it('deve retornar um token válido', () => {
            const chaveSecreta = 'fakeKey';
            const token = 'fakeToken';
            crypto.randomBytes.mockReturnValue(Buffer.from(chaveSecreta));
            jwt.sign.mockReturnValue(token);

            const cliente = new Cliente(nome, email, cpf);
            const result = cliente.gerarToken();

            expect(result).toBe(token);
        });
    });
});