"use client"
import React from 'react'

const HotelAmenities = ({children}:{children:React.ReactNode}) => {
  return (
     <span className='text-sm flex gap-2 items-center'>{children}</span> 
  )
}

export default HotelAmenities
