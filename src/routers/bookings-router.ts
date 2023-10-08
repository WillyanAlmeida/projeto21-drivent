import { Router } from 'express';
import { alterBooking, getBooking, postBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingsRouter = Router();
bookingsRouter
.all('/*', authenticateToken)
.get('/', getBooking)
.post('/', postBooking)
.put('/:bookingId', alterBooking);

export { bookingsRouter };
