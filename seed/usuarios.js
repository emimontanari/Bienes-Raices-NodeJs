import bcrypt from 'bcrypt'

const usuarios = [

    {
        nombre: 'Emiliano',
        email: 'emi@emi.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios