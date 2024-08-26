import prisma from "@/prisma/client";

export const getHotelById = async (hotelid: string) => {
    try {
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: hotelid,
        },
        include: {
          rooms: true,
        },
      });
      if (!hotel) return null;
      return hotel;
    } catch (error) {
      return null;
    }
  };