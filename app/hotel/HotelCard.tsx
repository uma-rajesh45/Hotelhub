"use client";
import { cn } from "@/lib/utils";
import { Hotel, Room } from "@prisma/client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import HotelAmenities from "./HotelAmenities";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import useLocation from "@/hooks/useLocation";
type HotelWithRooms = {
  hotel?:
    | (Hotel & {
        rooms: Room[];
      })
    | null;
};
const HotelCard = ({ hotel }: HotelWithRooms) => {
  const router = useRouter();
  const path = usePathname();
  const isPathNameExists = path.includes("my-hotels");
  const {getCountryByCode,getStateByCode} = useLocation();
  const country = getCountryByCode(hotel?.country!);
  const state=getStateByCode(hotel?.state!,country?.isoCode!) 
  return (
    <div
      onClick={() =>
        !isPathNameExists && router.push(`/hotel-details/${hotel?.id}`)
      }
      className={cn(
        `hover:scale-105 transition-transform cursor-pointer`,
        isPathNameExists && `cursor-default`
      )}
    >
      <div className="flex gap-1 bg-background/50 border border-primary/10 rounded-lg min-h-[300px]">
          <Image
            height={300}
            width={350}
            src={hotel?.image!}
            alt={hotel?.title!}
            priority
            className="object-cover w-[180px] md:w-[300px] md:h-[300px]"
          />
        <div className="flex flex-col justify-between h-[210px] gap-1 pr-4 py-2 text-sm">
          <h3 className="font-semibold text-xl">{hotel?.title}</h3>
          <div className="text-primary/90">
            {hotel?.description.substring(0, 45)}...
          </div>
          <div className="text-primary/90">
            <HotelAmenities>
              <MapPin className="w-4 h-4" /> {country?.name}, {state?.name}
            </HotelAmenities>
            {hotel?.swimmingpool && (
              <HotelAmenities>
                <Waves className="w-4 h-4" /> Pool
              </HotelAmenities>
            )}
            {hotel?.gym && (
              <HotelAmenities>
                <Dumbbell className="w-4 h-4" /> Gym
              </HotelAmenities>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                {hotel?.rooms[0]?.roomprice&&<>
                <div>${hotel.rooms[0].roomprice}</div>
                <div className="text-xs">/ 24Hrs</div>
                </>}
            </div>
            {isPathNameExists&&<Button onClick={()=>router.push(`/hotel/${hotel?.id}`)} variant="outline">Edit</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
