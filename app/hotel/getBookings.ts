import prisma from "@/prisma/client";

export async function getBookings(hotelid:string){
    try {
       const yesterDay = new Date();
       yesterDay.setDate(yesterDay.getDate()-1);
       const bookings = await prisma.booking.findMany({
       where:{
        hotelid,
        enddate:{
            gt:yesterDay
        }
       }
       })
       return bookings;
    } catch (error) {
        return null;
    }
}

