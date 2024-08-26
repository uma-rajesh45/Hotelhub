import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest)=>{
   
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("unauthorized",{status:400})
        }
        const body = await req.json();
        const hotel = await prisma.hotel.create({
            data:{
                ...body,
                userid:userId
            }
        })
        return NextResponse.json(hotel,{status:201})  
    } catch (error) {
        return new NextResponse("Internal Server Error Please Try Again later",{status:500});
    }
}
