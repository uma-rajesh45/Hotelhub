import dynamic from "next/dynamic";
import getAllHotels from "./hotel/getAllHotels";
const HotelList = dynamic(()=>import("./hotel/HotelList"),{ssr:false})

interface searchParams {
  title: string;
  country: string;
  state: string;
  city: string;
}
export default async function Home(searchParams:searchParams) {
  const hotels = await getAllHotels(searchParams);
 
  if(!hotels) return <div>No Hotels Found :{'('}</div>
 
  
  return (
    <div>
    <HotelList hotel = {hotels}/>
    </div>
  );
}
