import { Hotel } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getAllHotels, getHotelById } from '@/repositories/hotels-repository';

async function showHotels(req: Request, res: Response): Promise<Response<Hotel[]>> {
  const { hotelsId } = req?.params;

  if (!hotelsId) {
    try {
      const hotels = await getAllHotels();
      return res.status(httpStatus.OK).send(hotels);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).send({});
    }
  } else {
    try {
      const hotel = await getHotelById(Number(hotelsId));
      return res.status(httpStatus.OK).send(hotel);
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).send({});
    }
  }
}

export { showHotels };
