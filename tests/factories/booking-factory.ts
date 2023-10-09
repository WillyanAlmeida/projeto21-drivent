import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createRoom(hotelId: number, capacity: number) {
    return prisma.room.create({
      data: {
        name: "suit Presidential",
        capacity: capacity,
        hotelId: hotelId,
      },
    });
  }