import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
 
const utapi = new UTApi();
export const POST =async (req:Request)=>{
    const {userId} = auth();
    if(!userId) return NextResponse.json("Unauthorized",{status:401})
    const {imageKey} = await req.json();
    try {
        const res = utapi.deleteFiles(imageKey);
        return NextResponse.json(res,{status:200})
    } catch (error) {
        return NextResponse.json("Internal Server Error :)",{status:500})
    }
}