import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export const getHotelsByUserId =async ()=>{
    const {userId} = auth();
    if(!userId){
        throw new Error("unauthorized")
    }
    try {
        const bookings = await prisma.booking.findMany({
            where:{
                userid:userId
            },
            include:{
                room:true,
                hotel:true
            },
        }) 
        if(!bookings) return null;
        return bookings;
    } catch (error) {
        throw new Error("something is wrong with the ")
    }
}