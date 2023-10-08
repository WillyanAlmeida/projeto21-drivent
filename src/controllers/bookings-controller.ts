import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const bookings = await bookingsService.getBooking(userId);
    res.status(httpStatus.OK).send(bookings);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    const creatbooking = await bookingsService.postBooking(roomId, userId);

    res.status(httpStatus.OK).send({bookingId: creatbooking.id });
}

export async function alterBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const  roomId  = Number(req.params.roomId );

    const alterbooking = await bookingsService.alterBooking(roomId, userId);
    res.status(httpStatus.OK).send(alterbooking);
}

