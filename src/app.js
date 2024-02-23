import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'

const app = express()
const port = 8080

app.listen(port, () => console.log("Servidor corriendo en puerto ", port))

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)