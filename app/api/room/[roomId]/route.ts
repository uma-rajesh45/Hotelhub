import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH =async (req:NextRequest,{params}:{params:{roomId:string}})=>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("unauthorized",{status:400})
    }
    try {
        const body = await req.json();
        const updatedRoom =await prisma.room.update({
            where: {
                id: params.roomId
            },
            data: {...body}
        })
        return NextResponse.json(updatedRoom,{status:200});
    } catch (error) {
        return new NextResponse("Something is wrong with server so please try again later")
    }
}
export const DELETE =async (req:NextRequest,{params}:{params:{roomId:string}})=>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("unauthorized",{status:400})
    }
    try {
        await prisma.room.delete({
            where: {
                id: params.roomId
            },
        })
        return NextResponse.json({status:200});
    } catch (error) {
        return new NextResponse("Something is wrong with server so please try again later",{status:500})
    }
}
