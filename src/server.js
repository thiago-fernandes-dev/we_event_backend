const express = require('express');
require('dotenv').config();
const userRoutes = require('./modules/auth/user.routes');
const ticketRoutes = require('./modules/tickets/ticket.routes');

const app = express();
const PORT = process.env.PORT || 4250;
const HOST = process.env.HOST || "localhost";

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api', ticketRoutes);

app.listen(PORT, () => {
    console.log(`O servidor está rodando em http://${HOST}:${PORT}`);
})