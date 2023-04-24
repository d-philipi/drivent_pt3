import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoom } from '../factories/hotel-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const newUser = await createUser();
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('Should respond with status 404 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when there is no hotel for event', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 402 when there is no payment for ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when there is no includes hotel for ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when event is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 200 when is ok about enrollment, ticket and hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
          }),
        ]),
      );
    });
  });
});

describe('GET /hotels/:hotelsId', () => {
  it('Should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if there is no session for given token', async () => {
    const newUser = await createUser();
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is valid', () => {
    it('Should respond with status 404 when there is no enrollment for given user', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when there is no ticket for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 404 when there is no hotel for event', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 402 when there is no payment for ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createHotel();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when there is no includes hotel for ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 402 when event is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('Should respond with status 200 when is ok about enrollment, ticket and hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();
      await createRoom();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            room: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                capacity: expect.any(Number),
                hotelId: expect.any(Number),
              }),
            ]),
          }),
        ]),
      );
    });
  });
});
