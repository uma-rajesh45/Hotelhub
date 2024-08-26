"use client";
import useBookRoom from '@/hooks/useBookRoom';
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast';
import { Separator } from '../ui/separator';
import moment from "moment"
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { isWithinInterval, startOfDay } from 'date-fns';
import { Booking } from '@prisma/client';
interface RoomPaymentFormProps{
    clientSecret:string;
    handleSetPaymentSuccess:(value:boolean)=>void
}
type DateRangesType = {
    startDate:Date,
    endDate:Date
}
const hasOverLap = (startDate:Date,endDate:Date,dateRanges:DateRangesType[])=>{
    const targetInterval = {start:startOfDay(new Date(startDate)),end:startOfDay(new Date(endDate))}
    for(const range of dateRanges){
        const rangeStart = startOfDay(new Date(range.startDate));
        const rangeEnd = startOfDay(new Date(range.endDate));
        if(isWithinInterval(targetInterval.start,{start:rangeStart,end:rangeEnd}) ||isWithinInterval(targetInterval.end,{start:rangeStart,end:rangeEnd})||targetInterval.start<rangeStart&&targetInterval.end>rangeEnd){
        return true;
        }
    }
    return false;
}
const RoomPaymentForm = ({clientSecret,handleSetPaymentSuccess}:RoomPaymentFormProps) => {
    const {bookingRoomData,resetBookRoom} = useBookRoom();
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading,setIsLoading] = useState(false)
    const {toast} = useToast()
    const router = useRouter();
    useEffect(()=>{
        if(!stripe){
            return
        }
        if(!clientSecret){
            return
        }
        handleSetPaymentSuccess(false)
        setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stripe])
    const handleSubmit =async (value:React.FormEvent)=>{
        value.preventDefault();
        setIsLoading(true)
        if(!stripe||!elements||!bookingRoomData){
            return;
        }
        try {
            const bookings = await axios.get(`/api/booking/${bookingRoomData.room?.id}`)
            const roomBookingDates = bookings.data.map((booking:Booking)=>{
                return {
                    startDate:booking.startdate,
                    endDate:booking.enddate
                }
            })
            const overLapFound = hasOverLap(bookingRoomData.startdate,bookingRoomData.enddate,roomBookingDates)
            if(overLapFound){
                setIsLoading(false)
                return toast({
                    variant:"destructive",
                    description:"you cannot select the dates that are already reserved ! or you can try other rooms in this hotel"
                })
            }

         await stripe.confirmPayment({elements,redirect:'if_required'}).then((result)=>{
            if(!result.error){
                axios.patch(`/api/booking/${result.paymentIntent.id}`).then((res)=>{
                    toast({
                        variant:'default',
                        description:'Room reserved'
                    })
                    router.refresh();
                    resetBookRoom();
                    handleSetPaymentSuccess(true);
                    setIsLoading(false)
                }).catch((err)=>{
                    toast({
                        variant:"destructive",
                        description:"something went wrong :("
                    })
                    setIsLoading(false)
                })
            } else {
                setIsLoading(false)
            }
           }) 
        } catch (error) {
            setIsLoading(false)
        }
    }
    if(!bookingRoomData?.startdate||!bookingRoomData.enddate) return <div>Missing reservation dates :{'('}</div>
    const startDate = moment(bookingRoomData.startdate).format('MMMM Do YYYY')
    const endDate = moment(bookingRoomData.enddate).format('MMMM Do YYYY')

  return (
    <form onSubmit={handleSubmit} id='payment-form'>
        <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
        <AddressElement options={{
            mode:"billing",
            
        }}/>
        <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
        <PaymentElement id='payment-element' options={{
            layout:"tabs"
        }}/>
        <div className='flex flex-col gap-3'>
            <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
            <div>You will check-in on {startDate}</div>
            <div>You will check-out before {endDate}</div>
            {bookingRoomData?.breakfastincluded&&
            <div>You will be served breakfast each day at 8AM</div>
            }
            <Separator/>
            <div className="font-bold text-lg">
                {bookingRoomData?.breakfastincluded&&
                <div className="mb-2">
                    Breakfast Price :${bookingRoomData?.room?.breakfastprice}
                </div>
               
                }
                 Total Price:${bookingRoomData?.totalprice}
            </div>
        </div>
        {isLoading&&
        <Alert className="bg-indigo-600 mb-3 text-white p-3 w-full font-bold mt-20 flex flex-col justify-center">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Payment in process...</AlertTitle>
        <AlertDescription>
        Dont leave this page as we processing the payment
        </AlertDescription>
      </Alert>
        }
        <Button disabled={isLoading}>{isLoading?'Processing Payment...':'Pay Now'}</Button>
    </form>
  )
}

export default RoomPaymentForm
