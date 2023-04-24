import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from './authentication-middleware';
import { getAllHotels } from '@/repositories/hotels-repository';
import enrollmentsService from '@/services/enrollments-service';
import ticketService from '@/services/tickets-service';

export async function validateSteps(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    await enrollmentsService.getOneWithAddressByUserId(userId);
    const hotels = await getAllHotels();

    if (hotels.length === 0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const ticket = await ticketService.getTicketByUserId(userId);

    if (ticket.status !== 'PAID') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    return next();
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
