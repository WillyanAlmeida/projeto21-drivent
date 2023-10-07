import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const hotels = await bookingsService.getBooking();
    res.status(httpStatus.OK).send(hotels);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    const creatbooking = await bookingsService.postBooking(roomId, userId);
    console.log(creatbooking)
    res.status(httpStatus.OK).send({bookingId: creatbooking.id });
}

export async function alterBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotelId = Number(req.params.hotelId);

    const hotelWithRooms = await bookingsService.alterBooking();
    res.status(httpStatus.OK).send(hotelWithRooms);
}

