import faker from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export function createHotel(params: Partial<Hotel> = {}) {
  return prisma.hotel.createMany({
    data: [
      {
        name: params.name || faker.lorem.sentence(),
        image: params.image || faker.image.imageUrl(),
      },
      {
        name: params.name || faker.lorem.sentence(),
        image: params.image || faker.image.imageUrl(),
      },
    ],
  });
}

export async function createRoom(params: Partial<Room> = {}) {
  const hotels = await prisma.hotel.findMany({});

  if (hotels.length === 0) await createHotel();

  return prisma.room.createMany({
    data: [
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[0].id || 1,
      },
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[0].id || 1,
      },
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[0].id || 1,
      },
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[1].id || 2,
      },
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[1].id || 2,
      },
      {
        name: params.name || faker.lorem.sentence(),
        capacity: faker.datatype.number({ min: 1, max: 5 }),
        hotelId: hotels[1].id || 2,
      },
    ],
  });
}
