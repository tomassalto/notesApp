const mongoose = require("mongoose");

const dbConnect = (app) => {
  mongoose
    .connect(
      "mongodb+srv://tomassalto:15WilaZ8GtyUxvob@cluster0.nsxmpbx.mongodb.net/"
    )
    .then((result) => {
      const PORT = process.env.PORT;
      app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
      });
      console.log("Conexion Exitosa a BDD");

      // Product.updateMany({}, {$set: {deleted:false}}).then(res => console.log(res) 
      // )
    })
    .catch((err) => console.log(err));
};

module.exports = dbConnect;
