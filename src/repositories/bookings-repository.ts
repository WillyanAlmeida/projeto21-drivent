import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomById(roomId: number) {
    console.log('findroombyId')
    const result = await prisma.room.findUnique({
        where: { id: roomId },
        // include: { TicketType: true },
    });
    console.log(result)
    return result;
}

async function findBookingWithRoomId(roomId: number) {
    const result = await prisma.booking.findMany({
        where: { roomId: roomId }
    });

    return result;
}
async function findBookingWithRoomIdByUser(userId: number) {
    const result = await prisma.booking.findMany({
        where: { userId: userId }
    });

    return result;
}

async function upsertBooking(roomId: number, userId: number) {
    console.log('upsert')
    const booking = {
        roomId,
        userId
    }
    const result = await prisma.booking.upsert({
        where: {
            id: userId,
        },
        update: {
            roomId: roomId
        },
        create: booking

    });
    console.log(result)
    return result;
}





export const bookingsRepository = {
    findRoomById,
    findBookingWithRoomId,
    upsertBooking,
    findBookingWithRoomIdByUser

};
