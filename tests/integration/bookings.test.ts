import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createBooking, createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('Post /bookings', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 400 when  for given user', async () => {
            const token = await generateValidToken();

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

    })






    it('should respond with status 403 if room is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id, 0);
        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: createdRoom.id });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id, 3);
        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: createdRoom.id });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({ bookingId: response.body.bookingId });

    });



});
describe('Post /bookings/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 200 and returns bookingId', async () => {

            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const randomRoom = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, randomRoom.id);
            const body = { roomId: room.id };
            console.log(body)
            console.log(user.id)
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
            console.log(response.body)
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual(
                expect.objectContaining({
                    bookingId: expect.any(Number),
                }),
            );

        })



    })

    describe('get /bookings', () => {
        it('should respond with status 401 if no token is given', async () => {
            const response = await server.get('/booking');

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
        it('should respond with status 401 if given token is not valid', async () => {
            const token = faker.lorem.word();

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
        it('should respond with status 401 if there is no session for given token', async () => {
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
        describe('when token is valid', () => {
            it('should respond with status 400 when  for given user', async () => {
                const token = await generateValidToken();

                const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            });

        })

        it('should respond with status 200 and booking by user', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const createdHotel = await createHotel();

            const createdRoom = await createRoomWithHotelId(createdHotel.id, 3);
            const booking = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: createdRoom.id });
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({ id: booking.body.bookingId, room: response.body.room });

        });



    })


})
