import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getAllHotels(): Promise<resultHotel[]> {
  const result = await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return result;
}

type resultHotel = Omit<Hotel, 'createdAt' | 'updatedAt'>;

async function getHotelById(id: number) {
  const result = await prisma.hotel.findMany({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      Rooms: {
        select: {
          name: true,
          capacity: true,
        },
      },
    },
  });

  return result;
}

export { getAllHotels, getHotelById };
