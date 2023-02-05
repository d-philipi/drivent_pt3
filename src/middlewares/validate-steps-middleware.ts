import { getAllHotels } from "@/repositories/hotels-repository";
import enrollmentsService from "@/services/enrollments-service";
import ticketService from "@/services/tickets-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "./authentication-middleware";

export async function validateSteps(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
  
    try {
      await enrollmentsService.getOneWithAddressByUserId(userId);
      await getAllHotels();

      const ticket = await ticketService.getTicketByUserId(userId);

      if(ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
      };

      return next();
    } catch (error) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
};