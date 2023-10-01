import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import httpStatus from 'http-status';


export const getHotels = async(req: AuthenticatedRequest, res: Response)=>{
    const { userId } = req;
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels); 
}

export const getRoomsByHotelId = async(req: AuthenticatedRequest, res: Response)=>{
    const { userId } = req;
    const hotelId = Number(req.params.hotelId)
    const rooms = await hotelsService.getHotelById(userId, hotelId)
    res.status(httpStatus.OK).send(rooms);
}