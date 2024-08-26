import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import prisma from '@/prisma/client';
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY as string,{
    apiVersion:"2024-06-20"
})
export async function POST(req:Request){
    const user = await currentUser();
    if(!user) return new NextResponse("Unauthorized",{status:401});
    const body = await req.json();
    const {booking,payment_intent_id} = body;
    const bookingData = {
        ...booking,
        username:user.firstName,
        useremail:user.emailAddresses[0].emailAddress,
        userid:user.id,
        currency:"usd",
        paymentintentid:payment_intent_id
    } 
    let foundBooking;
    if(payment_intent_id){
        foundBooking = await prisma.booking.findUnique({
            where:{paymentintentid:payment_intent_id,userid:user.id}
        })

    }
    if(foundBooking&&payment_intent_id){
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
        if(current_intent){
            const updated_intent = await stripe.paymentIntents.update(payment_intent_id,{
                amount:booking.totalprice*100
            })
            const res = await prisma.booking.update({
                where:{paymentintentid:payment_intent_id,userid:user.id},
                data:bookingData
            })
            if(!res){
                return NextResponse.error();
            }
            return NextResponse.json({paymentIntent:updated_intent})

        }

    } else {
        const paymentIntent = await stripe.paymentIntents.create({
            amount:booking.totalprice *100,
            currency:bookingData.currency,
            automatic_payment_methods:{enabled:true}
        })
        bookingData.paymentintentid = paymentIntent.id;
        await prisma.booking.create({
            data:bookingData
        })
        return NextResponse.json({paymentIntent})
    }
    return new NextResponse("internal server error",{status:500})
}