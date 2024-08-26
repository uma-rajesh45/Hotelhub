/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  FieldName,
  formSchema,
  hotelAmenities,
} from "@/validationSchemas/HotelSchema";
import { UploadButton } from "@/components/uploadthing";
import { useEffect, useState } from "react";
import { Booking, Hotel, Room } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import AlertDialogBox from "./AlertDialogBox";
import { Plus, Terminal } from "lucide-react";
import AddRoomForm from "./AddRoomForm";
import dynamic from "next/dynamic";
const RoomCard = dynamic(()=>import("./RoomCard"),{ssr:false})
export type FormProps = {
  hotel?:
    | (Hotel & {
        rooms: Room[];
      })
    | null;
    bookings?:Booking[]
};
const HotelForm = ({ hotel,bookings=[] }: FormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [image, setImage] = useState<string|undefined>(hotel?.image);
  const [imageDelete, setImageDelete] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [open,setOpen] = useState(false)
  const {
    getAllCountries,
    getCountryStates,
    getStateCities,
    getCityByCoutryCode,
  } = useLocation();
  const [submitting, setIsSubmitting] = useState(false);
  const hotelDetails: { label: string; value: FieldName }[] = [
    { label: "Title", value: "title" },
    { label: "Description", value: "description" },
  ];

  const hotelAmenities: { label: string; value: hotelAmenities }[] = [
    { label: "Gym", value: "gym" },
    { label: "Spa", value: "spa" },
    { label: "Bar", value: "bar" },
    { label: "Laundry", value: "laundry" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Shopping", value: "shopping" },
    { label: "FreeParking", value: "freeparking" },
    { label: "BikeRenatal", value: "bikerental" },
    { label: "FreeWifi", value: "freewifi" },
    { label: "MovieNights", value: "movienights" },
    { label: "SwimmingPool", value: "swimmingpool" },
    { label: "CoffeShop", value: "coffeshop" },
  ];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationdescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      shopping: false,
      freeparking: false,
      bikerental: false,
      freewifi: false,
      movienights: false,
      swimmingpool: false,
      coffeshop: false,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (hotel) {
      axios
        .patch(`/api/hotel/${hotel.id}`, values)
        .then((res) => {
          toast({
            description: "Hotel Updated Successfully :)",
          });
          setIsSubmitting(false);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: "something went wrong !",
          });
          setIsSubmitting(false);
        });
    } else {
      axios
        .post("/api/hotel", values)
        .then((res) => {
          toast({
            description: "Hotel Created Successfully :)",
          });
          setIsSubmitting(false);
          router.push(`/hotel/${res.data.id}`);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: "something went wrong !",
          });
          setIsSubmitting(false);
        });
    }
  }
  const handleDialougeOpen = ()=>{
    setOpen(prev=>!prev)
  }
  const deleteImage = (image: string) => {
    setImageDelete(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.status === 200) {
          setImage("");
          toast({
            variant: "default",
            description: "Image is Successfully deleted",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "something went wrong!",
        });
      })
      .finally(() => {
        setImageDelete(false);
      });
  };
  const countryDependency = form.watch("country");
  const stateDependency = form.watch("state");
  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [image]);
  useEffect(() => {
    const country = form.watch("country");
    const countryStates = getCountryStates(country);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [countryDependency]);
  useEffect(() => {
    const country = form.watch("country");
    const countryStates = form.watch("state");
    const stateCities = getStateCities(country, countryStates!);
    const coutryCities = getCityByCoutryCode(country);
    if (stateCities || coutryCities) {
      setCities(stateCities || coutryCities);
    }
  }, [countryDependency, stateDependency]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="font-bold text-3xl pt-10 pb-10">
          Choose Hotel Features:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 p-3 gap-8">
          {hotelDetails.map((hotel) => (
            <div key={hotel.value} className="w-full">
              <FormField
                control={form.control}
                name={hotel.value}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{hotel.label}</FormLabel>
                    <FormControl>
                      {hotel.label === "Description" ||
                      hotel.label === "LocationDescription" ? (
                        <Textarea placeholder={hotel.label} {...field} />
                      ) : (
                        <Input
                          className="min-h-[80px]"
                          placeholder={hotel.label}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">
                  Select A Country Of Your Hotel!
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={submitting}
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="min-h-[80px]">
                      <SelectValue placeholder="Select a country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getAllCountries.map((country) => (
                        <SelectItem
                          value={country.isoCode}
                          key={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Select State</FormLabel>
                <FormControl>
                  <Select
                    disabled={submitting || states.length < 1}
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="min-h-[80px]">
                      <SelectValue placeholder="Select a State..." />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem value={state.isoCode} key={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-2">Select City:</FormLabel>
                <FormControl>
                  <Select
                    disabled={submitting || states.length < 1}
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="min-h-[80px]">
                      <SelectValue placeholder="Select a city..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem value={city.name} key={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationdescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description of the location</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex:The hotel is located at near the beach"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hotelAmenities.map((hotel) => (
            <FormField
              key={hotel.value}
              control={form.control}
              name={hotel.value}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 border border-gray-400-600 rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="pb-2">{hotel.label}</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="mb-20">
          {hotel && hotel.rooms.length < 1 && (
            <Alert className="bg-indigo-600 text-white m-auto p-3 w-full md:w-3/6 font-bold mt-20 flex flex-col justify-center">
              <Terminal className="h-4 w-4" />
              <AlertTitle>You are successfully created your hotel!</AlertTitle>
              <AlertDescription>
                Please add rooms of your hotel by clicking add hotel button to
                get started 🔥!
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="m-auto flex justify-center mb-20 w-full">
        {hotel && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center justify-center text-white bg-secondary md:w-3/6 min-h-10  rounded-lg bg-slate-700 font-bold"><Plus className="w-4 h-5"/>Add Room</DialogTrigger>
            <DialogContent className="min-w-[90%]">
              <DialogHeader>
                <DialogTitle>Add Room For Your Hotel!</DialogTitle>
                <DialogDescription>
                  Provide details for the room
                </DialogDescription>
              </DialogHeader>
              <AddRoomForm hotel={hotel} handleDialougeOpen={handleDialougeOpen}/>
            </DialogContent>
          </Dialog>
        )}
        </div>
        <div className="m-auto w-full px-3 md:w-3/6 mt-10">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-center border border-gray-400 rounded-lg h-96">
                <FormLabel className="pb-5 text-xl font-bold">
                  Upload A Image Of Your Hotel
                </FormLabel>

                <FormControl>
                  {image ? (
                    <>
                      <div className="flex flex-1 !min-w-full !min-h-full border-none">
                        <Image
                          src={image}
                          alt="Hotel image"
                          width={1000}
                          height={300}
                        />
                      </div>
                      <Button
                        disabled={imageDelete}
                        variant="destructive"
                        className="mb-2"
                        onClick={()=>deleteImage(image)}
                      >
                        Delete Image
                      </Button>
                    </>
                  ) : (
                  
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          setImage(res[0].url);
                          toast({
                            title:
                              "Your Image Has Been Uploaded Sucessfully! :)",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          toast({
                            variant: "destructive",
                            description: `${error.message}`,
                          });
                        }}
                      />
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {hotel ? (
          <Button
            disabled={submitting}
            type="submit"
            className="m-auto mb-10  p-3 w-3/6 font-bold mt-20 flex justify-center"
          >
            Update Hotel
          </Button>
        ) : (
          <Button
            disabled={submitting}
            type="submit"
            className="m-auto mb-10  p-3 w-3/6 font-bold mt-20 flex justify-center"
          >
            Create
          </Button>
        )}
        {hotel&&hotel.rooms.length>0&&
        (hotel.rooms.map((room)=><div key={room.id} className="flex flex-col items-start mt-6"><RoomCard  hotel={hotel} room={room} bookings={bookings}/></div>))}
        {hotel && <AlertDialogBox hotel={hotel} />}
        
      </form>
    </Form>
  );
};

export default HotelForm;
