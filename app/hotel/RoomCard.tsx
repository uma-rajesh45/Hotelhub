"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Booking, Hotel, Room } from "@prisma/client";
import {
  AirVent,
  Bath,
  Bed,
  BedDoubleIcon,
  BedSingleIcon,
  Building2,
  CircleDollarSign,
  Cookie,
  Loader2,
  Mountain,
  NotebookPen,
  Pencil,
  PersonStanding,
  Speech,
  TentTree,
  Trash2,
  Tv,
  ViewIcon,
  Wand2,
  Waves,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import HotelAmenities from "./HotelAmenities";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import { DatePickerWithRange } from "./DateRangePicker";
type FormProps = {
  hotel?:
    | Hotel & {
        rooms: Room[];
      };
  room?: Room;
  bookings?: Booking[];
};
const RoomCard = ({ hotel, room, bookings = [] }: FormProps) => {
  const [open, setOpen] = useState(false);
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const pathname = usePathname();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { userId } = useAuth();
  const path = pathname.includes("hotel-details");
  const bookRoom = pathname.includes("book-room");
  const hotelEditPage = pathname.includes("hotel")
  const handleDialougeOpen = () => {
    setOpen((prev) => !prev);
  };
  const [deleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalprice, setTotalPrice] = useState(room?.roomprice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    if (date && date.to && date.from) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      if (dayCount && room?.roomprice) {
        if (includeBreakFast && room.breakfastprice) {
          setTotalPrice(
            dayCount * room.roomprice + dayCount * room.breakfastprice
          );
        } else {
          setTotalPrice(dayCount * room.roomprice);
        }
      } else {
        setTotalPrice(room?.roomprice);
      }
    }
  }, [date, room?.roomprice, includeBreakFast, room?.breakfastprice]);
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    const roomBookings = bookings?.filter(
      (booking) => booking.roomid === room?.id && booking.paymentstatus
    );
    roomBookings?.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startdate),
        end: new Date(booking.enddate),
      });
      dates = [...dates, ...range];
    });
    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);
  const deleteRoom = async () => {
    setIsDeleting(true);
    try {
      const getImageKey = (imageUrl: string) =>
        imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      const imageKey = getImageKey(room?.image!);
      try {
        setIsDeleting(false);
        await axios.delete(`/api/room/${room?.id}`);
        await axios.post("/api/uploadthing/delete", { imageKey });
        router.refresh();
        toast({
          variant: "default",
          description: "Your room Is Successfully Deleted :)",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Internal server error :( or login problem",
        });
        setIsDeleting(false);
      }
      setIsDeleting(false);
    } catch (error) {
      toast({
        description: "something is wrong with the server!",
      });
      setIsDeleting(false);
    }
  };
  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Oops make sure to signin!",
      });
    if (date?.from && date?.to) {
      setBookingIsLoading(true);
      const bookingRoomData = {
        room,
        totalprice,
        breakfastincluded: includeBreakFast,
        startdate: date.from,
        enddate: date.to,
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
            startdate: date.from,
            enddate: date.to,
            breakfastincluded: includeBreakFast,
            totalprice,
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
      <CardHeader className="max-w-96">
        <CardTitle>{room?.title}</CardTitle>
        <CardDescription>{room?.description}</CardDescription>
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

          <div className="grid grid-cols-2 gap-6 gap-x-40 md:gap-x-36 pt-4 min-h-[200px]">
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
          <div className="grid mt-5 grid-cols-2 gap-16 w-full">
            <span className="flex gap-2 items-center">
              Roomprice :${room?.roomprice}
            </span>
            <span className="flex gap-2 items-center">
              Breakfastprice :${room?.breakfastprice}
            </span>
          </div>
          <div className="mt-5 flex flex-col w-full">
            {path ? (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="mb-2">
                    Select Days That You Spend In The Room:
                  </div>

                  <DatePickerWithRange
                    date={date}
                    setDate={setDate}
                    disabledDates={disabledDates}
                    
                  />
                </div>
                <Separator/>
                {room?.breakfastprice! > 0 && (
                  <div>
                    <div className="mb-2">
                     Do You Want To Be Served A Tasty Breakfast EachDay?
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="breakfast"
                        onCheckedChange={(value) =>
                          setIncludeBreakFast(!!value)
                        }
                      />
                      <label htmlFor="breakfast">Include breakfast</label>
                    </div>
                  </div>
                )}
                <Separator/>
                <div>
                  Total Price: <span className="font-bold">${totalprice}</span>{" "}
                  for <span className="font-bold">{days} Days</span>
                </div>
              </div>
            ) : !bookRoom ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button type="button">
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[90%]">
                  <DialogHeader>
                    <DialogTitle>Add Room For Your Hotel!</DialogTitle>
                    <DialogDescription>
                      Provide details for the room
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    room={room}
                    hotel={hotel}
                    handleDialougeOpen={handleDialougeOpen}
                  />
                </DialogContent>
              </Dialog>
            ) : null}

            {path
              ? null
              : !bookRoom && (
                  <AlertDialog>
                    <AlertDialogTrigger disabled={deleting} className=" mt-5">
                      <Button variant="destructive" type="button">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete room{deleting && <Loader2 />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your room and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteRoom}
                          className="bg-destructive text-white"
                        >
                          Continue{deleting && <Loader2 />}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
          </div>
        </div>
      </CardContent>
      {!hotelEditPage?
      ((!bookRoom) && (
        <Button
          disabled={bookingIsLoading}
          type="button"
          onClick={() => handleBookRoom()}
        >
          {bookingIsLoading ? (
            <Loader2 className="mr-2 h-4 w-4" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {bookingIsLoading ? "Loading..." : "Book Room"}
        </Button>
      )):((!bookRoom) && (
        <Button
          disabled={bookingIsLoading}
          type="button"
          onClick={() => handleBookRoom()}
        >
          {bookingIsLoading ? (
            <Loader2 className="mr-2 h-4 w-4" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {bookingIsLoading ? "Loading..." : "Book Room"}
        </Button>
      ))
    }
      
    </Card>
  );
};

export default RoomCard;
