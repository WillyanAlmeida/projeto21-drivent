
import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';


async function findById(userId: number) {
    const ticket = prisma.ticket.findFirst({ where: { AND: { Enrollment: { userId } } }, include: { TicketType: true } });
    return ticket
}

async function findTicketsType() {
    return await prisma.ticketType.findMany()

}

export async function getTicketTypeById(ticketTypeId: number) {
    const result = await prisma.ticketType.findUnique({
        where: { id: ticketTypeId }
    })
    return result
}

async function newTicket(ticketTypeId: number, enrollment: number) {
    return await prisma.ticket.create({
        data: {
            ticketTypeId: ticketTypeId,
            enrollmentId: enrollment,
            status: "RESERVED"
        },include: { TicketType: true } 
    })
}



export const TicketsRepository = {
    findById,
    findTicketsType,
    getTicketTypeById,
    newTicket
};
