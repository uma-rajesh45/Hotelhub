"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import useBookRoom from "@/hooks/useBookRoom";
import { useAuth } from "@clerk/nextjs";
import { Booking, Hotel, Room } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import {
  AirVent,
  Bath,
  Bed,
  BedDoubleIcon,
  BedSingleIcon,
  Building2,
  MapPin,
  Mountain,
  NotebookPen,
  PersonStanding,
  Speech,
  TentTree,
  Tv,
  ViewIcon,
  Waves,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import {  useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import HotelAmenities from "../hotel/HotelAmenities";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
type MyHotelsListProps = {
  booking: Booking & { room: Room | null } & { hotel: Hotel | null };
};
const MyHotelsList = ({ booking }: MyHotelsListProps) => {
  const { room, hotel } = booking;
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { userId } = useAuth();
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel?.country!);
  const state = getStateByCode(hotel?.state!,hotel?.country!)
  const router = useRouter();
  const { toast } = useToast();
  const startDate =moment(booking.startdate).format("MMMM Do YYYY") 
  const endDate = moment(booking.enddate).format("MMMM Do YYYY")
  const dayCount = differenceInCalendarDays(booking.enddate,booking.startdate)
 
  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Oops make sure to signin!",
      });
    if (booking.startdate && booking.enddate) {
      setBookingIsLoading(true);
      const bookingRoomData = {
        room: room,
        totalprice: booking.totalprice,
        breakfastincluded: booking.breakfastincluded,
        startdate: booking.startdate,
        enddate: booking.enddate,
      };
      setRoomData(bookingRoomData);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelownerid: hotel?.userid,
            hotelid: hotel?.id,
            roomid: room?.id,
            startdate: booking.startdate,
            enddate: booking.enddate,
            breakfastincluded: booking.breakfastincluded,
            totalprice:booking.totalprice
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-room");
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            description: `error! ${err.message}`,
          });
        });
    } else {
      toast({
        variant: "destructive",
        description: "Select Room Dates!",
      });
    }
  };
  return (
    <Card className="m-auto p-3 min-h-[1200px] font-bold flex flex-col justify-center">
      <CardHeader>
        <CardTitle>{room?.title}</CardTitle>
        <CardDescription>{room?.description}</CardDescription>
        <span className="flex gap-2 items-center"><MapPin className="w-4 h-4"/>{country?.name}, {state?.name}</span>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center flex-col items-center">
          <div className="relative flex items-center justify-center w-full md:w-[25rem] h-[15rem]">
            <Image
              src={room?.image!}
              alt={room?.title!}
              fill
              className="rounded-md"
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 gap-x-40 md:gap-x-36 mt-5">
            <HotelAmenities>
              <Bed className="w-4 h-4" />
              <span>
                {room?.bedcount} Bed{"(s)"}
              </span>
            </HotelAmenities>
            <HotelAmenities>
              <PersonStanding className="w-4 h-4" />
              {room?.guestcount} Guest{"(s)"}
            </HotelAmenities>
            <HotelAmenities>
              <Bath className="w-4 h-4" />
              {room?.bathroomcount} Bathroom{"(s)"}
            </HotelAmenities>
            {room?.kingbed! > 0 && (
              <HotelAmenities>
                <BedDoubleIcon className="w-4 h-4" />
                {room?.kingbed} Kingbed{"(s)"}
              </HotelAmenities>
            )}
            {room?.queenbed! > 0 && (
              <HotelAmenities>
                <BedSingleIcon className="w-4 h-4" />
                {room?.queenbed} Queenbed{"(s)"}
              </HotelAmenities>
            )}
            {room?.roomservice && (
              <HotelAmenities>
                <NotebookPen className="w-4 h-4" />
                Roomservice
              </HotelAmenities>
            )}
            {room?.tv && (
              <HotelAmenities>
                <Tv className="w-4 h-4" />
                Tv
              </HotelAmenities>
            )}
            {room?.balcony && (
              <HotelAmenities>
                <ViewIcon className="w-4 h-4" />
                Balcony
              </HotelAmenities>
            )}{" "}
            {room?.freewifi && (
              <HotelAmenities>
                <Wifi className="w-4 h-4" />
                Wifi
              </HotelAmenities>
            )}
            {room?.cityview && (
              <HotelAmenities>
                <Building2 className="w-4 h-4" />
                Cityview
              </HotelAmenities>
            )}{" "}
            {room?.oceanview && (
              <HotelAmenities>
                <Waves className="w-4 h-4" />
                Oceanview
              </HotelAmenities>
            )}{" "}
            {room?.mountainview && (
              <HotelAmenities>
                <Mountain className="w-4 h-4" />
                MountainView
              </HotelAmenities>
            )}{" "}
            {room?.forestview && (
              <HotelAmenities>
                <TentTree className="w-4 h-4" />
                Forestview
              </HotelAmenities>
            )}{" "}
            {room?.aircondition && (
              <HotelAmenities>
                <AirVent className="w-4 h-4" />
                Airconditioned
              </HotelAmenities>
            )}{" "}
            {room?.soundproofed && (
              <HotelAmenities>
                <Speech className="w-4 h-4" />
                Soundproofed
              </HotelAmenities>
            )}
          </div>
          <Separator className="mt-10" />
          <div className="grid mt-5 grid-cols-2 gap-16">
            <span className="flex gap-2 items-center">
              Roomprice :${room?.roomprice}
            </span>
            <span className="flex gap-2 items-center">
              Breakfastprice :${room?.breakfastprice}
            </span>
          </div>
        </div>
        <Separator className="mt-3"/>
        <div className="flex flex-col gap-5 mt-3">
          <h3>Booking Details</h3>
          <div className="text-primary/90 flex flex-col gap-3">
            <div>
              Room booked by {booking.username} for {dayCount} days -{" "}
              {moment(booking.bookedat).fromNow()}
            </div>
            <div>Check-in at {startDate} after 12AM</div>
            <div>Check-out at {endDate} before 12PM</div>
            {booking.breakfastincluded&&
            <div>Breakfast will be served :{')'}</div>
            }
            {booking.paymentstatus?
            <div className="text-teal-600">Paid ${booking.totalprice} - Room Reserved</div>  :
            <div className="text-rose-700">Not Paid ${booking.totalprice} - Room is not reserved</div>
          }
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button disabled={bookingIsLoading} variant="outline" onClick={()=>router.push(`/hotel-details/${hotel?.id}`)}>View Hotel</Button>
        {!booking.paymentstatus&&booking.userid===userId&&
        <Button disabled={bookingIsLoading} variant="outline" onClick={()=>handleBookRoom()}>Pay Now</Button>
        }
      </CardFooter>
    </Card>
  );
};

export default MyHotelsList;
