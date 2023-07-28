const Product = require("../Models/product");

const getProducts = async (req, res) => {
  const products = await Product.find({ deleted: false }).sort({ _id: -1 });

  res.status(200).json({ ok: true, products, data: products.length });
};

const getProductsArchived = async (req, res) => {
  const products = await Product.find({ deleted: true }).sort({ _id: -1 });

  res.status(200).json({ ok: true, products, data: products.length });
};

const createProduct = (req, res) => {
  if (!req.body.name) {
    res.status(400).json({
      ok: false,
      message: "Tenes que poner el nombre",
    });
    return;
  }
  const newProduct = new Product(req.body);

  newProduct
    .save()
    .then((product) => {
      res
        .status(201)
        .json({ ok: true, product, message: "Producto creado con éxito!" });
    })
    .catch((err) => console.log(err));
};

const archiveProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, {
    deleted: true,
})
  res.status(200).json({ ok: true, message: "Producto archivado con éxito!" });
  console.log({ id });
};

// const updateProduct =  (req,res) =>{
//   const {id} = req.params;  
//   const updateProduct = Product.findByIdAndUpdate(id);  
//   updateProduct.set(req.body).save().then((product) => {
//     res
//       .status(200)
//       .json({ ok: true, message: `Producto ${product} modificado con éxito!` });
//   });
// }

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        ok: false,
        message: "No se encontró el producto para actualizar.",
      });
    }

    res.status(200).json({
      ok: true,
      product: updatedProduct,
      message: "Producto modificado con éxito.",
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error al actualizar el producto." });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(200).json({ ok: true, message: "Producto eliminado con exito!" });
};
module.exports = { getProducts, createProduct, deleteProduct, archiveProduct, updateProduct, getProductsArchived };
