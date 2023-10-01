import { prisma } from '@/config';





async function allHotels() {

    const result = await prisma.hotel.findMany();
    console.log(result)
    return result
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
