import { ApplicationError } from '@/protocols';

export function bookingForbiddenError(): ApplicationError {
  return {
    name: 'bookingForbiddenError',
    message: 'It is not possible to make a reservation, room is full',
  };
}
