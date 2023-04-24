import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getAllHotels(): Promise<resultHotel[]> {
  const result = await prisma.hotel.findMany();

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
const hotelsRepository = {
  getAllHotels,
  getHotelById,
};
export default hotelsRepository;
