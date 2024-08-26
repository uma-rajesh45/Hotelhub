import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server"

export const getHotelsByUserId = async ()=>{
    try {
        const {userId} = auth();
        if(!userId){
            throw new Error("Unauthorized")
        }
        const hotels = await prisma.hotel.findMany({
            where:{
                userid:userId
            },
            include:{
                rooms:true
            }
        })
        if(!hotels) return null;
        return hotels;
    } catch (error) {
        
    }
}