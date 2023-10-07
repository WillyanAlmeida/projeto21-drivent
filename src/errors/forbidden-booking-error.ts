import { ApplicationError } from '@/protocols';

export function BookingForbiddenError(): ApplicationError {
  return {
    name: 'BookingForbiddenError',
    message: 'It is not possible to make a reservation, room is full',
  };
}
