import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//Crear la app
const app = express()
//Habilitar la lectura de formularios
app.use(express.urlencoded({extended:true}))
//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexion a la base de datos
try {
    await db.authenticate()
    db.sync()
    console.log('Conexion Correcta a la base de datos')
} catch (error) {
    console.log(error)
}
//Habulitar Pug
app.set('view engine', 'pug')
app.set('views', './views')
//Carpeta publica
app.use(express.static('public'))

//Routing
app.use('/auth', usuarioRoutes)


//Definir el puerto
const port =process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`El servidor corriendo en el puerto ${port}`)
})