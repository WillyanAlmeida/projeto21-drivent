import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { bookingForbiddenError, invalidDataError, notFoundError } from '@/errors';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { hotelsService } from './hotels-service';
import { bookingsRepository } from '@/repositories/bookings-repository';
import { threadId } from 'worker_threads';

async function getBooking() {
    //const booking = await bookingRepository.findFirst();
    //if (!evebookingnt) throw notFoundError();

    //return exclude(event, 'createdAt', 'updatedAt');
}

//export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function postBooking(roomId: number, userId: number) {
    if (!roomId || isNaN(roomId) || roomId == undefined) throw invalidDataError('roomId');

    await hotelsService.validateUserBooking(userId);

    const bookRoom = await bookingsRepository.findBookingWithRoomId(roomId)

    const room = await bookingsRepository.findRoomById(roomId)
    if (!room) throw notFoundError();
    if((bookRoom.length-room.capacity)==0) throw bookingForbiddenError() 

    const createdBook = await bookingsRepository.upsertBooking(roomId, userId)
    return createdBook

}

async function alterBooking(roomId: number, userId: number) {
    if (!roomId || isNaN(roomId) || roomId == undefined) throw invalidDataError('roomId');

    await hotelsService.validateUserBooking(userId);

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