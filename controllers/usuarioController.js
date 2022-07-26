import { check,validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarId,generarjwt } from '../helpers/tokens.js'
import { emailRegristro,emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req,res) =>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    //Validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
           
        })
    }

    const {email, password} = req.body

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario No existe'}]
        })
    }
    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }

    //Revisar el password

    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Password es incorrecto'}]
        })
    }
    //Autenticar el usuario
    const token = generarjwt({id: usuario.id, nombre: usuario.nombre})
    
    
    // Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true
    }).redirect('/mis-propiedades')
    

}
const formularioRegristro = (req,res) =>{

    res.render('auth/registro',{
       pagina: 'Crear Cuenta',
       csrfToken: req.csrfToken()
    })
}

const registrar = async (req,res) =>{
    //Validacion del formulario
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Eso no es un email').run(req)
    await check('password').isLength({min:6}).withMessage('El password debe ser al menos de 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    //Extraer los datos
    const {nombre, email, password} = req.body

    //Veirificar si el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where: {email}})
    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })
    //Envia email de confirmacion
    emailRegristro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmacion, presiona en el enlace'
    })
}
//Funcion que compuerba una cuenta
const confirmar = async (req,res) =>{
    const {token} = req.params

    //Verificaar si el tooken es valido
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    //Confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save()
    
    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })


}

const formularioOlvidePassword = (req,res) =>{
    res.render('auth/olvide-password',{
       pagina: 'Recupera tu acceso a Bienes Raices',
       csrfToken: req.csrfToken()
    })
}
const resetPassword = async (req,res) => {
    await check('email').isEmail().withMessage('Eso no es un email').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
            
        })
    }
    //Buscar el usuario
    const {email} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a ningun usuario'}]
            
        })
    }
    //Generar un token y enviar el email
    usuario.token = generarId()
    await usuario.save()

    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })


    //Renderizar un mensaje
    res.render('templates/mensaje',{
        pagina: 'Restablece tu Password',
        mensaje: 'Hemos Enviado un Email con las instrucciones'
    })
}

const comprobarToken = async (req, res)=> {
    const {token} = req.params
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }

    //Mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        pagina: 'Restablece Tu Password',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req,res) =>{
    //Validar el password
    await check('password').isLength({min:6}).withMessage('El password debe ser al menos de 6 caracteres').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const {token} = req.params
    const {password} = req.body
    //identificar quien hace el cambio

    const usuario = await Usuario.findOne({where: {token}})

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    
    //Guardar el usuario
    await usuario.save()

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardo correctamente'
    })
}
export{
    formularioLogin,
    formularioRegristro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}