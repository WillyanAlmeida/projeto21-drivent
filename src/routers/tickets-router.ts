import { TicketPosts, getTickets, getTicketsType } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';


const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);

ticketsRouter.get('/types', getTicketsType)
ticketsRouter.get('/', getTickets )
ticketsRouter.post('/', TicketPosts)



export { ticketsRouter };
