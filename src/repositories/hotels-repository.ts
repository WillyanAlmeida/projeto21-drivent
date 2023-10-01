import { prisma } from '@/config';





async function allHotels() {

    return await prisma.hotel.findMany();
   
}

async function hotelById(hotelId: number) {
    const userRooms = await prisma.room.findMany({
        where:{hotelId}
    })
    return userRooms;
  }

export const hotelsRepository = {
    allHotels,
    hotelById
};
