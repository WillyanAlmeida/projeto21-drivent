import { Router } from 'express';
import { alterBooking, getBooking, postBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingsRouter = Router();
bookingsRouter
.all('/*', authenticateToken)
//bookingsRouter.get('/', getBooking);
.post('/', postBooking);
bookingsRouter.put('/:bookingId', alterBooking);

export { bookingsRouter };
