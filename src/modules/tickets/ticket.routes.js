const ticketControllers = require('./ticket.controllers');
const express = require('express');
const authMiddleware = require('../../shared/auth');

const router = express.Router();

router.use('/tickets', authMiddleware);

router.get('/tickets', ticketControllers.getTicketsController);
router.get('/tickets/:id', ticketControllers.getTicketByIdController);
router.post('/tickets/:id', ticketControllers.createTicketController);
router.delete('/tickets/:id', ticketControllers.deleteTicketController);
router.put('/tickets/:id', ticketControllers.updateTicketController);

module.exports = router;