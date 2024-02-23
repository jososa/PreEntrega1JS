import { Router } from "express"
import fs from "fs"

const productsRouter = Router()

productsRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null
        const prod = fs.readFileSync("./src/data/Products.json")
        const products = JSON.parse(prod);
        let allProd = products;
        if (limit) {
            allProd = products.slice(0, limit)
        }
        
        res.send(allProd);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

productsRouter.get("/:prodId", async (req, res) => {
    try {
        const prodId = parseInt(req.params.prodId)
        const prod = fs.readFileSync("./src/data/Products.json");
        const productos = JSON.parse(prod)
        
        const product = productos.find(producto => producto.id === prodId)
        
        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" })
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

productsRouter.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail
        } = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." })
        }

        const prod = fs.readFileSync("./src/data/Products.json")
        const products = JSON.parse(prod)
        
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail
        }

        products.push(newProduct)

        fs.writeFileSync("./src/data/Products.json", JSON.stringify(products, null, 2))

        res.status(200).json({ message: "Producto agregado" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

productsRouter.put("/:prodId", async (req, res) => {
    try {
        const prodId = parseInt(req.params.prodId)
        const prodField = req.body

        const rawData = fs.readFileSync("./src/data/Products.json")
        let products = JSON.parse(rawData)

        const index = products.findIndex(product => product.id === prodId)
        
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        const updatedProduct = { ...products[index] }

        for (const field in prodField) {
            if (field !== "id") { 
                updatedProduct[field] = prodField[field]
            }
        }

        products[index] = updatedProduct

        fs.writeFileSync("./src/data/Products.json", JSON.stringify(products, null, 2))

        res.json({ message: "Producto actualizado" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

productsRouter.delete("/:prodId", async (req, res) => {
    try {
        const prodId = parseInt(req.params.prodId)

        const prod = fs.readFileSync("./src/data/Products.json")
        let products = JSON.parse(prod)

        const index = products.findIndex(product => product.id === prodId)
        
        if (index === -1) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        products.splice(index, 1)

        fs.writeFileSync("./src/data/Products.json", JSON.stringify(products, null, 2))

        res.json({ message: "Producto eliminado" })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

export default productsRouter