import dynamic from "next/dynamic";
import getAllHotels from "./hotel/getAllHotels";
const HotelList = dynamic(() => import("./hotel/HotelList"), { ssr: false });

interface SearchParams {
  title?: string;
  country?: string;
  state?: string;
  city?: string;
}

const Home = async ({ searchParams }: { searchParams: SearchParams }) => {
  const hotels = await getAllHotels(searchParams);

  if (!hotels) return <div>No Hotels Found {":("}</div>;

  return (
    <div>
      <HotelList hotel={hotels} />
    </div>
  );
};

export default Home;