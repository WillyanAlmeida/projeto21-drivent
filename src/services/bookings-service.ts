import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { bookingForbiddenError, invalidDataError, notFoundError } from '@/errors';
import { eventRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { hotelsService } from './hotels-service';
import { bookingsRepository } from '@/repositories/bookings-repository';

async function getBooking() {
    //const booking = await bookingRepository.findFirst();
    //if (!evebookingnt) throw notFoundError();

    //return exclude(event, 'createdAt', 'updatedAt');
}

//export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function postBooking(roomId: number, userId: number) {
    console.log(roomId)
    if (!roomId || isNaN(roomId) || roomId == undefined) throw invalidDataError('roomId');

    await hotelsService.validateUserBooking(userId);

    const bookRoom = await bookingsRepository.findBookingWithRoomId(roomId)

    const room = await bookingsRepository.findRoomById(roomId)
    if (!room) throw notFoundError();
    if((bookRoom.length-room.capacity)==0) throw bookingForbiddenError() 

    const createdBook = await bookingsRepository.createBooking(roomId, userId)
    return createdBook

}

async function alterBooking() {
    const event = await eventRepository.findFirst();
    if (!event) return false;

    const now = dayjs();
    const eventStartsAt = dayjs(event.startsAt);
    const eventEndsAt = dayjs(event.endsAt);

    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

export const bookingsService = {
    getBooking,
    postBooking,
    alterBooking
};
