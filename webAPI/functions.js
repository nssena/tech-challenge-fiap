// const pool = require("../infrastructure/persistence/Database");

// const verificarEmailExistente = async(email) => {

//     const emailConsultado = 'select * from clientes where email = $1';
//     const resultadoConsultaEmail = await pool.query(emailConsultado, [email]);

//     if (resultadoConsultaEmail.rows.length > 0) {
//         return { cadastrado: true, campo: 'email'};
//     }

//     return { cadastrado: false};
// }

// const verificarCpfExistente = async(cpf) => {

//     const cpfConsultado = 'select * from clientes where cpf = $1';
//     const resultaConsultaCpf = await pool.query(cpfConsultado, [cpf]);
//     if (resultaConsultaCpf.rows.length > 0) {
//         return { cadastrado: true, campo: 'cpf'}
//     }

//     return { cadastrado: false};
// }

// module.exports = {
//     verificarEmailExistente,
//     verificarCpfExistente
// }