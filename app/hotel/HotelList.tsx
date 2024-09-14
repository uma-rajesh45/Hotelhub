"use client";
import React, { useEffect, useState } from "react";
import { Hotel, Room } from "@prisma/client";
import useSearchTerm from "@/hooks/useSearchTerm";
import dynamic from "next/dynamic";
import { LocationFilter } from "../Locationfilter";
const HotelCard = dynamic(() => import("./HotelCard"), { ssr: false });

type HotelWithRooms = {
  hotel?:
    | (Hotel & {
        rooms: Room[];
      })[]
    | null;
};

const HotelList = ({ hotel }: HotelWithRooms) => {
  const { title, state, city, country } = useSearchTerm();
  const [searchHotels, setSearchHotels] = useState(hotel || []);
  useEffect(() => {
    const searchResults = hotel?.filter((hotel) =>
      hotel.title.toLowerCase().includes(title?.toLowerCase() || "")
    );
    setSearchHotels(searchResults || []);
  }, [title, hotel]);
  useEffect(() => {
    const searchResults = hotel?.filter((hotel) =>
      hotel.country.startsWith((country as string) || "")
    );
    setSearchHotels(searchResults || []);
  }, [country, hotel]);
  useEffect(() => {
    const searchResults = hotel?.filter((hotel) =>
      hotel.state.startsWith((state as string) || "")
    );
    setSearchHotels(searchResults || []);
  }, [state, hotel]);
  useEffect(() => {
    const searchResults = hotel?.filter((hotel) =>
      hotel.city.startsWith((city as string) || "")
    );
    setSearchHotels(searchResults || []);
  }, [city, hotel]);

  return (
    <>
      <LocationFilter />
      <div className="grid mt-10 grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
        {searchHotels?.map((hotel) => (
          <div key={hotel?.id}>
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>
    </>
  );
};

export default HotelList;
