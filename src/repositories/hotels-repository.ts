import { prisma } from '@/config';





async function allHotels() {

    return await prisma.hotel.findMany();
   
}

async function hotelById(hotelId: number) {
    
    const Rooms = await prisma.hotel.findUnique({
        where:{id: hotelId},
        include: { Rooms: true }
    })
    return Rooms;
  }

export const hotelsRepository = {
    allHotels,
    hotelById
};
