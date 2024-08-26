import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server"

export const getHotelsByOwnerId =async ()=>{
    const {userId} = auth();
    if(!userId){
        throw new Error("unauthorized")
    }
    try {
        const bookings = await prisma.booking.findMany({
            where:{
                userid:userId,
                hotelownerid:userId
            },
            include:{
                room:true,
                hotel:true
            },
            orderBy:{
                bookedat:"desc"
            }
        }) 
        if(!bookings) return null;
        return bookings;
    } catch (error) {
        throw new Error("something is wrong with the server")
    }
}