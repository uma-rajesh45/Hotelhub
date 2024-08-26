import React from "react";
import { getHotelsByUserId } from "./getHotelsByUserId";
import HotelList from "../hotel/HotelList";

const page = async () => {
  const hotels = await getHotelsByUserId();
  if (!hotels) return <div>No hotels found...</div>;
  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold">Here are your hotels</h2>
      <HotelList hotel={hotels} />
    </div>
  );
};

export default page;
