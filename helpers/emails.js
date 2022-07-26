import nodemailer from 'nodemailer'

const emailRegristro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    
    const {email, nombre, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to:email,
        subject: 'Confirma tu cuenta en Bienesraices.com',
        text: 'Confirma tu cuenta en Bienesraices.com',
        html: `
            <p> Hola ${nombre}, comprueba tu cuenta en bienesRaices.com </p>

            <p>Tu cuenta ya esta lista, solo debes confirmala en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}"> Confirmar Cuenta </a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
        `
    })
}   

const emailOlvidePassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    
    const {email, nombre, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to:email,
        subject: 'Restablece tu Password en Bienesraices.com',
        text: 'Restablece tu Password en Bienesraices.com',
        html: `
            <p> Hola ${nombre}, Restablece tu Password en bienesRaices.com </p>

            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/olvide-password/${token}"> Restablece Password</a> </p>

            <p>Si tu no solicitaste el password, puedes ignorar el mensaje </p>
        `
    })
}   
export{
    emailRegristro,
    emailOlvidePassword
}