import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomById(roomId: number) {
    const result = await prisma.room.findUnique({
        where: { id: roomId },
        // include: { TicketType: true },
    });
    return result;
}

async function findBookingWithRoomId(roomId: number) {
    const result = await prisma.booking.findMany({
        where: { roomId: roomId }
    });

    return result;
}

async function createBooking(roomId: number, userId: number) {
     const booking = {
         roomId,
         userId
     }
     const result = await prisma.booking.create({
         data: booking,
         //include: { User: true }
     });

     return result;
}

async function findTicketById(ticketId: number) {
    const result = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { TicketType: true },
    });

    return result;
}

async function ticketProcessPayment(ticketId: number) {
    const result = prisma.ticket.update({
        where: {
            id: ticketId,
        },
        data: {
            status: TicketStatus.PAID,
        },
    });

    return result;
}

export const bookingsRepository = {
    findRoomById,
    findBookingWithRoomId,
    createBooking

};
