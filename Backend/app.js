const express = require('express');
const dbConnect = require('./config/db')
const cors = require("cors");
require('dotenv').config()
const app = express();
app.use(cors());
const productRouter = require('./Routes/NoteRoute')

//conectarse a la app
dbConnect(app);

app.use(cors({ origin: true }));

app.use(express.json())

//usar rutas
app.use('/api/v1/products', productRouter)