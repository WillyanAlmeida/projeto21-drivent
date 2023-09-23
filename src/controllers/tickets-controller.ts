import { ticketsServices } from '@/services/tickets-service';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';


export async function getTicketsType(_req: AuthenticatedRequest, res: Response) {
    const result = await ticketsServices.getTicketsTypes()
    res.status(httpStatus.OK).send(result) 
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
 const result = await ticketsServices.getTicketsByUser(userId)
 return res.status(httpStatus.OK).send(result)
}

export async function TicketPosts(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { ticketTypeId } = req.body as {ticketTypeId: number};
    const create = await ticketsServices.postTicket(userId, ticketTypeId)
  
    return res.status(httpStatus.CREATED).send(create);
  }