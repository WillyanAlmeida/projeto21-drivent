import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress, createUser, createTicketType, createTicket,
    createPayment,
    generateCreditCardData,
    createHotel,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with erro 404  when there are no enrollment', async () => {
            const token = await generateValidToken();

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 and without existing Ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 When ticket without status PAID ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);



            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);

        });

        it('should respond with status 402 when TicketType isRemote ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 when includesHotel is false', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 404 When  ticket without status PAID ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);

        });

        it('should respond with status 200 When create hotel and return data ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();

            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.OK);
            expect(result.body).toEqual([
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString(),
                },
            ])

        });

    });


});

describe('GET /hotels/:hotelId', () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with erro 404  when there are no enrollment', async () => {
            const token = await generateValidToken();

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 and without existing Ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });


        it('should respond with status 402 when TicketType isRemote ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 when includesHotel is false', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 404 When  ticket without status PAID ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);

        });

        it('should respond with status 200 When create rooms and return data ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();

            const result = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.OK);
            expect(result.body).toEqual(
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString(),
                    Rooms: [],
                },
            )

        });

    });




})

