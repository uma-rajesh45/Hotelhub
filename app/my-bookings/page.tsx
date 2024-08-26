import React from "react";
import { getHotelsByUserId } from "./getBookingsByUserId";
import { getHotelsByOwnerId } from "./getBookingsByOwnerId";
import MyHotelsList from "./MyHotelsList";

const myhotelsPage = async () => {
  const userBookings = await getHotelsByUserId();
  const hotelBookings = await getHotelsByOwnerId();
  if (!userBookings && !hotelBookings)
    return <div>No Hotels has been booked at this time.</div>;
  return (
    <div className="flex flex-col gap-10">
      {!!userBookings?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Here are the bookings you have made!.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {userBookings.map((booking) => (
              <MyHotelsList booking={booking} key={booking.id} />
            ))}
          </div>
        </div>
      )}
      {!!hotelBookings?.length && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
            Bookings that customers made on your hotel!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotelBookings.map((booking) => (
              <MyHotelsList booking={booking} key={booking.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default myhotelsPage;
