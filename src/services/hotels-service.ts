import { Event, TicketStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import { exclude } from '@/utils/prisma-utils';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { PAYMENT_REQUIRED } from 'http-status';
import { paymentRequired } from '@/errors/payment-required-error';

async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) throw notFoundError();
    if (ticket.status==TicketStatus.RESERVED) throw paymentRequired('not paid');
    if (ticket.TicketType.isRemote) throw paymentRequired('is remote');
    if (!ticket.TicketType.includesHotel) throw paymentRequired('not includ hotel');
    const hotels = await hotelsRepository.allHotels();
    if (!hotels || hotels.length === 0) throw notFoundError();
    return hotels
    }


async function getHotelById(hotelId: number) {
    const event = await hotelsRepository.hotelById(hotelId);
    if (!event) return false;


    return ('ok')
}

export const hotelsService = {
    getHotels,
    getHotelById,
};
