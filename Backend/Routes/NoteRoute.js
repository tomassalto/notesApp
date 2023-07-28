const Router = require("express").Router();
const productController = require("../Controller/product");

// Ruta para crear un nuevo producto
Router.post("/", productController.createProduct);

// Ruta para obtener todos los productos
Router.get("/", productController.getProducts);

// Ruta para eliminar un producto por su ID
Router.delete("/:id", productController.deleteProduct);

// Ruta para archivar un producto por su ID
Router.delete("/archive/:id", productController.archiveProduct);

// Ruta para actualizar un producto por su ID
Router.put("/:id", productController.updateProduct);

Router.get("/archived/", productController.getProductsArchived)

module.exports = Router;
