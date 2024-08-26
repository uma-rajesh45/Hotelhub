import prisma from "@/prisma/client";

interface searchParams {
  title: string;
  country: string;
  state: string;
  city: string;
}
const getAllHotels = async (searchParams: searchParams) => {
    const {title,country,state, city} = searchParams;
    try {
        const hotels = await prisma.hotel.findMany({
            where:{
                title:{
                    contains:title
                },
                country,
                state,
                city
            },
            include:{rooms:true}
          })
          if(!hotels) return null;
          return hotels;
    } catch (error) {
        return null;
    }
  
};
export default getAllHotels;