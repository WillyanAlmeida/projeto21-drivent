import { ticketsServices } from '@/services/tickets-service';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';


export async function getTicketsType(req: Request, res: Response) {
 
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
 const result = await ticketsServices.getTicketsByUser(userId)
 console.log(result)
 return res.status(httpStatus.OK).send(result)
}

export async function TicketPosts(req: Request, res: Response) {
   // const { email, password } = req.body;
  
    
  
    return res.status(httpStatus.CREATED).json({
     
    });
  }