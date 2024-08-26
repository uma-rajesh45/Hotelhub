import { getHotelById } from '@/app/hotel/getHotelById'
import React from 'react'
import { getBookings } from '@/app/hotel/getBookings'
import dynamic from 'next/dynamic'
interface searchParams{
    params:{
        hotelId:string
    }
}
const HotelDetails = dynamic(()=>import("../HotelDetails"),{ssr:false})
const page =async ({params}:searchParams) => {
    const hotel = await getHotelById(params.hotelId)
    if(!hotel) return <div>oops! Hotel with given id is not found!</div>
    const bookings = await getBookings(hotel.id as string);
  return (
    <div>
        <HotelDetails hotel={hotel} bookings={bookings!}/>
    </div>
  )
}

export default page
