import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  let ticketTypes: any = await prisma.ticketType.findFirst();
  if(!ticketTypes){
    ticketTypes = await prisma.ticketType.createMany({
      data: [
        {
          name: "Primeiro tipo",
          price: 250,
          isRemote: false,
          includesHotel: true
        },
        {
          name: "Segundo tipo",
          price: 140,
          isRemote: true,
          includesHotel: false
        }
      ]
    })
  }

  let hotels: any = await prisma.hotel.findFirst();
  if(!hotels){
    hotels = await prisma.hotel.createMany({
      data: [
        {
          name: "Hotel 1",
          image: "https://media-cdn.tripadvisor.com/media/photo-s/22/25/ce/ea/kingsford-hotel-manila.jpg"
        },
        {
          name: "Hotel 2",
          image: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg"
        }
      ]
    })
  }

  let rooms: any = await prisma.room.findFirst();
  if(!rooms){
    rooms = await prisma.room.createMany({
      data : [
        {
          name: "Suíte",
          capacity: 3,
          hotelId: 1
        },
        {
          name: "Casal",
          capacity: 2,
          hotelId: 1
        },
        {
          name: "Solteiro",
          capacity: 1,
          hotelId: 1
        },
        {
          name: "Suíte",
          capacity: 3,
          hotelId: 2
        },
        {
          name: "Casal",
          capacity: 2,
          hotelId: 2
        },
        {
          name: "Solteiro",
          capacity: 1,
          hotelId: 2
        }
      ]
    })
  }

  console.log({ event, ticketTypes, hotels, rooms });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
