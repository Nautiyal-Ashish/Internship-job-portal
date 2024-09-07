require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainHandler = require('./mainHandler');

const app = express();

// middle ware 
app.use(cors());
app.use(express.json())

// connecting mongoose 
mongoose.connect(process.env.DB_URI).then(() => {
  console.log(`DB Connected Succesfully`);
}).catch(err => { console.log(`Error in DB`, err); })

// mainHandler 
app.use('api/v1', mainHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server Connected at ${PORT}`);
})