import { Router } from "express"
import fs from "fs"

const cartRouter = Router()

cartRouter.post("/", async (req, res) => {
    try {
        const cart = fs.readFileSync("./src/data/Cart.json")
        const carts = JSON.parse(cart);
        
        const cartId = carts.length + 1

        const newCart = {
            id: cartId,
            products: []
        }
        
        carts.push(newCart)
        
        fs.writeFileSync("./src/data/Cart.json", JSON.stringify(carts, null, 2))

        res.status(201).json({ message: "Carrito creado"})

    } catch (error) {
        console.error("Error al crear el carrito:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})


cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        
        const cartData = fs.readFileSync("./src/data/Cart.json")
        const carts = JSON.parse(cartData);
        
        const cart = carts.find(cart => cart.id === cid)
        
        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" })
        } else {
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

cartRouter.post("/:cid/product/:prodId", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const prodId = parseInt(req.params.prodId);
        let itemQuantity  = 1

        const cartData = fs.readFileSync("./src/data/Cart.json")
        let carts = JSON.parse(cartData)

        const cartIndex = carts.findIndex(cart => cart.id === cid)

        if (cartIndex === -1) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" })
        }

        const productToAdd = {
            product: prodId,
            quantity: parseInt(itemQuantity)
        }

        const existingProductIndex = carts[cartIndex].products.findIndex(item => item.product === prodId)

        if (existingProductIndex !== -1) {

            carts[cartIndex].products[existingProductIndex].quantity += parseInt(itemQuantity)
        } else {
            carts[cartIndex].products.push(productToAdd)
        }

        fs.writeFileSync("./src/data/Cart.json", JSON.stringify(carts, null, 2))

        res.json({ message: "Producto agregado al carrito" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

export default cartRouter