import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH =async (req:NextRequest,{params}:{params:{hotelId:string}})=>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("unauthorized",{status:400})
    }
    try {
        const body = await req.json();
        const updatedHotel =await prisma.hotel.update({
            where: {
                id: params.hotelId
            },
            data: {...body}
        })
        return NextResponse.json(updatedHotel,{status:200});
    } catch (error) {
        return new NextResponse("Something is wrong with server so please try again later")
    }
}
export const DELETE =async (req:NextRequest,{params}:{params:{hotelId:string}})=>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("unauthorized",{status:400})
    }
    try {
        const updatedHotel =await prisma.hotel.delete({
            where: {
                id: params.hotelId
            },
        })
        return NextResponse.json({status:200});
    } catch (error) {
        return new NextResponse("Something is wrong with server so please try again later",{status:500})
    }
}
