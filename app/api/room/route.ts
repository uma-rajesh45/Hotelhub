import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest)=>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("unauthorized",{status:400})
    }
    try {
        
        const body = await req.json();
        console.log(body)
        const room = await prisma.room.create({
            data:{...body}
        })
        return NextResponse.json(room,{status:201})  
    } catch (error) {
        return new NextResponse("Internal Server Error Please Try Again later",{status:500});
    }
}
