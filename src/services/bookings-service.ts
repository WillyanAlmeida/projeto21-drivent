import { TicketStatus } from '@prisma/client';
import { bookingForbiddenError, invalidDataError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository, bookingsRepository } from '@/repositories';
import { threadId } from 'worker_threads';
import { hotelsService } from './hotels-service';

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw bookingForbiddenError();
    console.log('valida u enroment')
    const ticket = await ticketsRepository .findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw bookingForbiddenError();
    console.log('valida u ticket')

    const type = ticket.TicketType;
  
    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
      throw bookingForbiddenError();
    }
    console.log('valida u ticket stus paid')
  }

export async function getBooking(userId: number) {
    if(!userId) throw notFoundError();
    await hotelsService.validateUserBooking(userId)
    const booking = await bookingsRepository.findBookingWithRoomIdByUser(userId);
    if(booking.length==0)throw notFoundError();
    if (!booking) throw notFoundError();
    const room = await bookingsRepository.findRoomById(booking[0].roomId)
    return ({id: booking[0].id, room: room})
}


async function postBooking(roomId: number, userId: number) {

    if (!roomId || isNaN(roomId) || roomId == undefined) throw invalidDataError('roomId');
    await validateUserBooking(userId);

    const bookRoom = await bookingsRepository.findBookingWithRoomId(roomId)
    const room = await bookingsRepository.findRoomById(roomId)
    if (!room) throw notFoundError();
    if((bookRoom.length-room.capacity)==0) throw bookingForbiddenError() 

    const createdBook = await bookingsRepository.upsertBooking(roomId, userId)

    return createdBook

}

async function alterBooking(roomId: number, userId: number) {
    if (!roomId || isNaN(roomId) || roomId == undefined) throw invalidDataError('roomId');
    await validateUserBooking(userId);
    console.log('valida ok')

    const roomByuser = await bookingsRepository.findBookingWithRoomIdByUser(userId)
    if(!roomByuser ) throw bookingForbiddenError();
    console.log('room by user ok')
    console.log(roomByuser[0].id)
    const bookRoom = await bookingsRepository.findBookingWithRoomId(roomId)    
    console.log('bookroom by ID ok')
    console.log(bookRoom[0])

    const room = await bookingsRepository.findRoomById(roomId)
    if (!room) throw notFoundError();
    if((bookRoom.length-room.capacity)==0) throw bookingForbiddenError() 
    console.log('room capacity ok')

     const createdBook = await bookingsRepository.upsertBooking(roomId, roomByuser[0].id)
     console.log(createdBook)
    return createdBook
}

export const bookingsService = {
    getBooking,
    postBooking,
    alterBooking,
    validateUserBooking
};
