"use client";
import React, { useEffect, useState } from 'react'
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js"
import useBookRoom from '@/hooks/useBookRoom';
import RoomCard from '@/app/hotel/RoomCard';
import {Elements} from "@stripe/react-stripe-js"
import RoomPaymentForm from './RoomPaymentForm';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';


const stripePromise=loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const BookRoomClient = () => {
   const {bookingRoomData,clientSecret} = useBookRoom();
   const [paymentSuccess,setPaymentSuccess] = useState(false);
   const [pageLoaded,setPageLoaded] = useState(false);
   const {theme} = useTheme();
   const router = useRouter();
   const options:StripeElementsOptions={
    clientSecret,
    appearance:{
        theme:theme==="dark"?"night":"stripe",
        labels:"floating"
    }
   }
   const handleSetPaymentSuccess = (value:boolean)=>{
    setPaymentSuccess(value)
   }
   useEffect(()=>{
    setPageLoaded(true)
   },[])
   if(paymentSuccess) return <div className='items-center flex flex-col gap-4'>
    <div className='text-teal-500 text-center'>Payment Success and Your Room is Reserved</div>
    <Button onClick={()=>router.push('/my-bookings')}>View Bookings</Button>
   </div>
   if(pageLoaded && !paymentSuccess && (!clientSecret||!bookingRoomData)){
    return <div className='text-rose-600 flex flex-col gap-6 items-center justify-center'> You cannot access this page!
    <div className='flex gap-6'>
        <Button onClick={()=>router.push("/")} variant="secondary">Go Home</Button>
        <Button onClick={()=>router.push("/my-bookings")}>View Bookings</Button>
    </div>
    </div>
   }
  return (
   <div className='min-w-[700px] mx-auto mb-10'>
    {clientSecret&&bookingRoomData&&
    <div className='flex flex-col items-center'>
        <h3 className="text-2xl font-semibold mb-6">Complete Payment To Reserve This Room!</h3>
        <div className="flex flex-col items-start mb-6">
            <RoomCard room={bookingRoomData.room!}/>
        </div>
        <Elements stripe={stripePromise} options={options}>
            <RoomPaymentForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements>
    </div>
    }
   </div>
  )
}

export default BookRoomClient
