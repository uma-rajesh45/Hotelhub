import React from "react";
import { auth } from "@clerk/nextjs/server";
import { Hotel, Room } from "@prisma/client";
import { getHotelById } from "../getHotelById";
import { redirect} from "next/navigation";
import HotelForm from "../HotelForm";
import { getBookings } from "../getBookings";

interface searchParams {
  params: {
    Id: string;
  };
}

export type HotelWithRooms =
  | (Hotel & {
      rooms: Room[];
    })
  | null;

const HotelPage = async ({ params }: searchParams) => {
  
  const hotel: HotelWithRooms = await getHotelById(params.Id);
  
  

  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (hotel === null || hotel?.userid !== userId) {
    return <div>You dont have access to this page...</div>;
  }

  return (
    <div >
      <HotelForm hotel={hotel}/>
    </div>
  );
};


export default HotelPage;
