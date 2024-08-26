"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Room } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import axios from "axios";
import { UploadButton } from "@/components/uploadthing";
import { useRouter } from "next/navigation";
type FormProps = {
  hotel?:
    | Hotel & {
        rooms: Room[];
      };
  room?: Room;
  handleDialougeOpen: () => void;
};
const formSchema = z.object({
  title: z.string().min(1, { message: "Title Is Required For The Room" }),
  description: z
    .string()
    .min(10, {
      message:
        "The Description Is Required And Atleast Should Be 10 Characters",
    }),
  bedcount: z.coerce.number().min(1, { message: "Bed Count Is Required" }),
  guestcount: z.coerce.number().min(1, { message: "Guest Count Is Required" }),
  bathroomcount: z.coerce
    .number()
    .min(1, { message: "Bathroom Count Is Required" }),
  kingbed: z.coerce.number().default(0).optional(),
  queenbed: z.coerce.number().default(0).optional(),
  image: z.string().min(1, { message: "Image is required" }),
  breakfastprice: z.coerce.number().min(10,{message:"BreakFast price is required"}),
  roomprice: z.coerce.number().min(10,{message:"BreakFast price is required"}),
  roomservice: z.boolean().optional(),
  tv: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freewifi: z.boolean().optional(),
  cityview: z.boolean().optional(),
  oceanview: z.boolean().optional(),
  forestview: z.boolean().optional(),
  mountainview: z.boolean().optional(),
  aircondition: z.boolean().optional(),
  soundproofed: z.boolean().optional(),
});
const roomAmenities: { label: string; value: keyof z.infer<typeof formSchema> }[] = [
    { label: "Tv", value: "tv" },
    { label: "Room Service", value: "roomservice" },
    { label: "Balcony", value: "balcony" },
    { label: "City View", value: "cityview" },
    { label: "Ocean View", value: "oceanview" },
    { label: "Forest View", value: "forestview" },
    { label: "Mountain View", value: "mountainview" },
    { label: "Air Condition", value: "aircondition" },
    { label: "Sound Proofed", value: "soundproofed" },
  ];

const AddRoomForm = ({ hotel, room, handleDialougeOpen }: FormProps) => {
    const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<string | undefined>(room?.image);
  const [imageDelete, setImageDelete] = useState(false);
  const {toast} = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedcount: 1,
      guestcount: 1,
      bathroomcount: 1,
      kingbed: 0,
      queenbed: 0,
      image: "",
      breakfastprice: 0,
      roomprice: 0,
      roomservice: false,
      tv: false,
      balcony: false,
      freewifi: false,
      cityview: false,
      oceanview: false,
      forestview: false,
      mountainview: false,
      aircondition: false,
      soundproofed: false,
    },
  });
  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (hotel&&room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then((res) => {
          toast({
            description: "Room Updated Successfully :)",
          });
          setIsSubmitting(false);
          handleDialougeOpen()
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
        .post("/api/room", {...values,hotelid:hotel?.id})
        .then((res) => {
          toast({
            description: "Room Created Successfully :)",
          });
          setIsSubmitting(false);
          handleDialougeOpen()
          router.refresh();
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
  const handleCreateRoom = () => {
    const values = form.getValues();
    const payload = {
      ...values,
      bedcount: Number(values.bedcount),
      guestcount: Number(values.guestcount),
      bathroomcount: Number(values.bathroomcount),
      kingbed: Number(values.kingbed),
      queenbed: Number(values.queenbed),
      breakfastprice: Number(values.breakfastprice),
      roomprice: Number(values.roomprice),
    };
    // Now you can use the payload as needed
    onSubmit(payload as z.infer<typeof formSchema>);
  };
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
  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe your room in a simple words."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your room."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bed Count *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="No.of beds in the room" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guestcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guest count *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Specify how many guests can fit in the room" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="bathroomcount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of bathrooms availble *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Number of bathrooms for the room" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="breakfastprice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum breakfast price *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter the cost of the breakfast" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="roomprice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room price *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter the price of the room" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {roomAmenities.map((hotel) => (
            <FormField
              key={hotel.value}
              control={form.control}
              name={hotel.value}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 border border-gray-400-600 rounded-lg">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange as (checked: boolean) => void}
                    />
                  </FormControl>
                  <FormLabel className="pb-2">{hotel.label}</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          </div>
          <div className="m-auto w-full px-3 md:w-3/6 mt-10 p-10">
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
                        onClick={() => deleteImage(image)}
                      >
                        Delete Image
                      </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {room ? (
          <Button
            disabled={submitting}
            type="button"
            onClick={()=>handleCreateRoom()}
            className="m-auto mb-10  p-3 w-3/6 font-bold mt-20 flex justify-center"
          >
            Update
          </Button>
        ) : (
          <Button
            disabled={submitting}
            onClick={()=>handleCreateRoom()}
            type="button"
            className="m-auto mb-10  p-3 w-3/6 font-bold mt-20 flex justify-center"
          >
            Create
          </Button>
        )}

        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
