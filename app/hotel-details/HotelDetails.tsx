"use client";

import { Booking } from "@prisma/client";
import { HotelWithRooms } from "../hotel/[Id]/page";
import Image from "next/image";
import HotelAmenities from "../hotel/HotelAmenities";
import { Car, Clapperboard, Dumbbell, MapPin, ShoppingBasket, Utensils, Wine } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { FaSpa, FaSwimmer } from "react-icons/fa";
import { MdDryCleaning } from "react-icons/md";
import RoomCard from "../hotel/RoomCard";

const HotelDetails = ({hotel,bookings}:{hotel:HotelWithRooms,bookings?:Booking[]})=>{
    const {getCountryByCode,getStateByCode} = useLocation();
    const country = getCountryByCode(hotel?.country!);
    const state = getStateByCode(hotel?.state!,country?.isoCode!);
    
return(
    <div className="flex flex-col gap-6 pb-2">
        <div className="aspect-square overflow-hidden relative h-[200px] md:h-[400px] rounded-lg">
            <Image
            fill
            src={hotel?.image!}
            alt={hotel?.title!}
            className="object-fill"
            />
        </div>
        <div>
            <h3 className="font-semibold text-xl md:text-3xl">{hotel?.title}</h3>
            <div className="mt-4">
                <HotelAmenities><MapPin className="h-4 w-4"/> {country?.name}, {state?.name}</HotelAmenities>
            </div>
            <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
            <p className="text-primary/90 mb-2">{hotel?.locationdescription}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
            <p className="text-primary/90 mb-2">{hotel?.description}</p>
            <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
                {hotel?.swimmingpool&&<HotelAmenities><FaSwimmer size={18}/> Pool</HotelAmenities>}
                {hotel?.gym&&<HotelAmenities><Dumbbell className="w-4 h-4"/> Gym</HotelAmenities>}
                {hotel?.spa&&<HotelAmenities><FaSpa size={18}/> Spa</HotelAmenities>}
                {hotel?.bar&&<HotelAmenities><Wine className="w-4 h-4"/> Bar</HotelAmenities>}
                {hotel?.laundry&&<HotelAmenities><MdDryCleaning size={18}/> Laundry Facilities</HotelAmenities>}
                {hotel?.restaurant&&<HotelAmenities><Utensils className="w-4 h-4"/> Restaurent</HotelAmenities>}
                {hotel?.shopping&&<HotelAmenities><ShoppingBasket className="w-4 h-4"/> Shopping</HotelAmenities>}
                {hotel?.freeparking&&<HotelAmenities><Car className="w-4 h-4"/> Free Parking</HotelAmenities>}
                {hotel?.movienights&&<HotelAmenities><Clapperboard className="w-4 h-4"/> Movie Nights</HotelAmenities>}
                {hotel?.coffeshop&&<HotelAmenities><Wine className="w-4 h-4"/> Coffee Shop</HotelAmenities>}

            </div>
        </div>
        <div>
            {hotel?.rooms?.length!>0 && 
            <div>
                <h3 className="text-lg font-semibold my-4 ">Hotel Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {hotel?.rooms.map((room)=><RoomCard room={room} hotel={hotel} key={room.id} bookings={bookings}/>)}
                </div>
            </div>
            }
        </div>
    </div>
)
}
export default HotelDetails;