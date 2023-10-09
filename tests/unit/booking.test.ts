import { bookingsRepository } from '@/repositories';
import { getBooking } from '@/services/bookings-service';
import { init } from '@/app';

init();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should return 404 when user doesnt have a booking', async () => {
    jest.spyOn(bookingsRepository, 'findBookingWithRoomIdByUser').mockResolvedValueOnce(null);

    const promise = getBooking (99);
    expect(promise).rejects.toMatchObject({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});