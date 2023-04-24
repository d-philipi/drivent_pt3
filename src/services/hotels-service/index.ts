import hotelsRepository from '@/repositories/hotels-repository';

async function findHotels() {
  const hotels = await hotelsRepository.getAllHotels();

  if (hotels.length === 0) throw new Error();

  return hotels;
}

async function findHotelsById(hotelId: number) {
  const hotel = await hotelsRepository.getHotelById(Number(hotelId));

  return hotel;
}

const hotelsService = {
  findHotels,
  findHotelsById,
};

export default hotelsService;
