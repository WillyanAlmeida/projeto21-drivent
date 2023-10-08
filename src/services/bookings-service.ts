import { Event, TicketStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { bookingForbiddenError, invalidDataError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository, bookingsRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { threadId } from 'worker_threads';
import { hotelsService } from './hotels-service';

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw bookingForbiddenError();
  
    const ticket = await ticketsRepository .findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw bookingForbiddenError();
  
    const type = ticket.TicketType;
  
    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
      throw bookingForbiddenError();
    }
  }

async function getBooking(userId: number) {
    if(!userId) throw notFoundError();
    await hotelsService.validateUserBooking(userId)
    const booking = await bookingsRepository.findBookingWithRoomIdByUser(userId);
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

    const roomByuser = await bookingsRepository.findBookingWithRoomIdByUser(userId)
    if(!roomByuser ) throw bookingForbiddenError();

    const bookRoom = await bookingsRepository.findBookingWithRoomId(roomId)    

    const room = await bookingsRepository.findRoomById(roomId)
    if (!room) throw notFoundError();
    if((bookRoom.length-room.capacity)==0) throw bookingForbiddenError() 

     const createdBook = await bookingsRepository.upsertBooking(roomId, roomByuser[0].userId)
    return createdBook
}

export const bookingsService = {
    getBooking,
    postBooking,
    alterBooking
};
