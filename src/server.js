require("dotenv").config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3450;

app.listen(PORT, ()=>{
    console.log(`servidor rodando em http://localhost:${PORT}`);
});