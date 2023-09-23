
import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';


async function findById(userId: number) {
    const ticket = prisma.ticket.findFirst({ where: { AND: { Enrollment: { userId } } }, include: { TicketType: true } });
    return ticket
}

async function findTicketsType() {
    return await prisma.ticketType.findMany()
  
}

async function newTicket() {
    //   return prisma.user.create({
    //     data,
    //   });
}



export const TicketsRepository = {
    findById,
    findTicketsType,
    newTicket
};
