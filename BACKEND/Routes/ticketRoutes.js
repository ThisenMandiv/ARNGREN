import express from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket } from '../Controllers/ticketController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Routes for tickets (protected by auth middleware)
router.post('/', requireAuth, createTicket); // Customer creates a ticket
router.get('/', requireAuth, getTickets); // Admin gets all tickets, customer gets their tickets
router.get('/:id', requireAuth, getTicketById); // Get a specific ticket
router.put('/:id', requireAuth, updateTicket); // Admin updates ticket, customer adds comments
router.delete('/:id', requireAuth, deleteTicket); // Admin deletes a ticket

export default router;